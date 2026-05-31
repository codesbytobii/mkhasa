export const useSearch = (allProducts, query) => {
    const result = allproducts?.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    return result
}