export const fields = new Array(72).fill(null).map((_, i)=>{
    return {
        id: i+1,
        isMine: false,
        isFlaged: false,
        isOpen: false
    }
})

