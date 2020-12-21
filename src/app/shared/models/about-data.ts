export interface AboutData {
    fullname: string;
    avatar: string;
    address: string
    phone: string;
    email: string;
    sites: {
        [sitename: string]: string;
    };
    title: string;
    aboutMe: string;
    skills: Array<string>;
}
