interface IWindowOptions {
    noopener?: boolean;
    width?: string;
    height?: string;
}
export declare function openLink(uri: string, target?: "_blank" | "_self", options?: IWindowOptions): Promise<any>;
export declare const encodeBase64Params: (value: any) => string;
export declare const decodeBase64Params: (value: string) => any;
export {};
//# sourceMappingURL=linking.d.ts.map