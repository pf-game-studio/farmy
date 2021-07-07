const user_db = [
    {
        username: 'teste',
        password: 'batata'
    }
];

export interface iUser {
    username: string;
    password: string;
}

export default {
    find(username: string): iUser | undefined {
        let user: iUser | undefined;

        user_db.forEach((us: iUser) => {
            if (us.username == username) {
                user = us;
            }
        });
        return user;
    }
};
