import {MapItem} from "@/interfaces/interfaces";

export function getItemTypesFromMapItems(mapItems: MapItem[]) {
    const itemTypesIdSet = new Set<string>();
    mapItems.forEach((i) => {
        itemTypesIdSet.add(i.type.id);
    });
    return Array.from(itemTypesIdSet).map((typeId) => {
        return mapItems.find((mapItem) => mapItem.type.id === typeId)!.type;
    });
}

export function arrayBufferToImgUrl(buffer: number[]): string {
    return (
        "data:image/png;base64," +
        window.btoa(new Uint8Array(buffer).reduce((res, byte) => res + String.fromCharCode(byte), ""))
    );
}

export function shuffleArray<T>(arr: T[]) {
    return arr.sort(function () {
        return 0.5 - Math.random();
    });
}

export function debounce(fn: Function, delay_ms: number) {
    let timer: NodeJS.Timeout;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...arguments);
        }, delay_ms);
    };
}