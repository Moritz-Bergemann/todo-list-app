import type { TodoItem } from "./types"

export function getElement(list: TodoItem[], id: number): TodoItem {
    let ii = 0;
    while (true) {
        if ( ii == list.length ){ throw Error("no item of id"); }
        if ( list[ii].id == id ) {
            return list[ii];
        }
        ii++;
    }
}