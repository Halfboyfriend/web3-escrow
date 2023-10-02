export const addressFormatter = (address) => {
    if(address){
        const newAddress = address.substring(0, 5) + "..." + address.substring(37, address.length)
    return newAddress;
    }
    return;
}