export interface Item {
    id: number
    buyer: string
    seller: string
    price: string
    name: string
    description: string
    imageUrl: string
    sold: boolean
}

export interface Store {
    id: number
    name: string
    description: string
    earnings: string
}