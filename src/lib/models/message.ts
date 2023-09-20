class Message {
    role: Role;
    content: string;

    constructor(role: Role, content: string) {
        this.role = role;
        this.content = content;
    }
}

export default Message;