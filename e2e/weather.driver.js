export const when = {
    pressOnCity: id => get.cityItem(id).tap(),
};


export const get = {
    cityItem: id => element(by.id(`cityItem-${id}`)),
    weatherItem: id => element(by.id(`weatherItem-${id}`))

};