export class JsonWrapper {
    json: () => Promise<any>

    constructor(item: any) {
        this.json = () => Promise.resolve(item)
    }
}

export async function wrapWithJson<T>(item: T): Promise<JsonWrapper> {
    return Promise.resolve(new JsonWrapper(item))
}