export class JsonWrapper<T> {
    json: () => Promise<T>

    constructor(item: any) {
        this.json = () => Promise.resolve(item)
    }
}

export async function wrapWithJson<T>(item: T): Promise<JsonWrapper<T>> {
    return Promise.resolve(new JsonWrapper(item))
}