export interface Emails {
    id: string,
    sender: string,
    receiver: string,
    message: string,
    senderStarred: boolean,
    receiverStarred: boolean,
    senderTrash: boolean,
    receiverTrash: boolean,
    delBySender: boolean,
    delByReceiver: boolean,
    msgDate: Date,
    readByReceiver: boolean,
    readBySender: boolean,
    subject: string
}

export interface Users {
    id: string,
    userEmail : string,
    userName: string,
    userGender: string,
    userDOB: Date,
    userPassword: string
}
