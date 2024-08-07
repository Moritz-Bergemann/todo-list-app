export function textWipth(text: string | string[]) {
    if ( text instanceof String ) {
        return singletextWipth(text)
    }
}

function manytextWipth(text: string[]) {

}

function singletextWipth(text: string) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext("2d")
    const width =  context?.measureText(text).width
    canvas.parentNode?.removeChild(canvas)
    return width
}