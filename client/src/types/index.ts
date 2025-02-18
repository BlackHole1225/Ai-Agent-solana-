export interface IAttachment {
    url: string;
    contentType: string;
    title: string;
}
export interface IWalletInfo  {
    wallet:{
        address:String,
        type:String
    }
}