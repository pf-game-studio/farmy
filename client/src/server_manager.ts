import io, { Socket } from 'socket.io-client';
import { GLOBALS } from './data/globals';

interface iOfferAnswerArgs {
    origin: string;
    description: RTCSessionDescription;
}

interface iOtherUsersArgs {
    first: string;
    second: string;
}

interface iCandidateArgs {
    origin: string;
    candidate: any;
}

interface iRackArgs {
    token: string;
}

interface iNackArgs {
    reason: string;
}

interface iConnection {
    local?: RTCPeerConnection;
    remote?: RTCPeerConnection;
}

const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

export default class ServerManager {
    private socket: Socket;
    private token: string;
    private audio: HTMLAudioElement;
    private stream?: MediaStream;
    private connection: iConnection;

    constructor() {
        this.audio = document.querySelector('audio') as HTMLAudioElement;
        this.connection = {};
        this.token = '';

        this.socket = io(GLOBALS.server_addr);

        this.socket.on('nack', (args: iNackArgs) => {
            console.log(`Received nack! Reason=${args.reason}`);
            this.do_auth();
        });

        this.socket.on('rack', (args: iRackArgs) => {
            this.token = args.token;
            console.log(`Received rack! Current token is ${this.token}`);
            this.socket.off('rack');
            this.socket.off('nack');
            this.connect_media();
        });

        this.do_auth();
    }

    do_auth() {
        const username = window.prompt('Digite seu usuário');
        const password = window.prompt('Digite sua senha');

        if (!username || !password) {
            this.do_auth();
        } else {
            this.socket.emit('register', { username, password });
        }
    }

    async connect_media() {
        this.stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
        });

        this.socket.on('other_users', (args: iOtherUsersArgs) => {
            if (args.second == this.socket.id) {
                this.connection.local = new RTCPeerConnection({ iceServers });

                this.stream?.getTracks().forEach(track => {
                    this.connection.local?.addTrack(
                        track,
                        this.stream as MediaStream
                    );
                });

                this.connection.local.onicecandidate = ({ candidate }) => {
                    candidate &&
                        this.socket.emit('candidate', {
                            destination: args.first,
                            candidate
                        });
                };

                this.connection.local.ontrack = ({ streams: [midias] }) => {
                    this.audio.srcObject = midias as MediaStream;
                };

                this.connection.local
                    .createOffer()
                    .then(offer =>
                        this.connection.local?.setLocalDescription(offer)
                    )
                    .then(() => {
                        this.socket.emit('offer', {
                            destination: args.first,
                            description: this.connection.local?.localDescription
                        });
                    });
            }
        });

        this.socket.on('offer', (args: iOfferAnswerArgs) => {
            const remote = new RTCPeerConnection({ iceServers });

            this.stream
                ?.getTracks()
                .forEach(track =>
                    remote.addTrack(track, this.stream as MediaStream)
                );

            remote.onicecandidate = ({ candidate }) => {
                candidate &&
                    this.socket.emit('candidate', {
                        destination: args.origin,
                        candidate
                    });
            };

            remote.ontrack = ({ streams: [midias] }) => {
                this.audio.srcObject = midias as MediaStream;
            };

            remote
                .setRemoteDescription(args.description)
                .then(() => remote.createAnswer())
                .then(answer => remote.setLocalDescription(answer))
                .then(() => {
                    this.socket.emit('answer', {
                        destination: args.origin,
                        description: remote.localDescription
                    });
                });

            this.connection.remote = remote;
        });

        this.socket.on('answer', (args: iOfferAnswerArgs) => {
            this.connection.local?.setRemoteDescription(args.description);
        });

        this.socket.on('candidate', (args: iCandidateArgs) => {
            const conn = this.connection.local || this.connection.remote;
            conn?.addIceCandidate(new RTCIceCandidate(args.candidate));
        });

        this.socket.emit('invite', { token: this.token });
    }
}
