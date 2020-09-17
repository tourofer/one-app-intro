export const when = {
    pressOnCity: id => get.cityItem(id).tap(),
    pressOnAddCity: () => element(by.id(`add-city-btn`)).tap(),
    typeCityQuery: (text) => element(by.id(`citySearchBox`)).typeText(text),
    tapOnFetchedCityWithId: id => element(by.id(`addCityItem-${id}`)).tap() 


};


export const get = {
    cityItem: id => element(by.id(`cityItem-${id}`)),
    weatherItem: id => element(by.id(`weatherItem-${id}`))

};