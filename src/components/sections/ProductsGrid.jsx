import ProductCard from "../../_features/products/ProductCard";
import NoResult from "../NoResult";
import { Product } from "../ProductCard";
import { Wrapper } from "../ui/Wrapper";

const ProductsGrid = ({ products }) => {
  return (
    <>
      <Wrapper>
        {products?.length === 0 || !products ? (
          <NoResult />
        ) : (
          <section className="grid gap-4  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {products?.map(({ product, name, category, price, discountedPrice, mainImage, _id }, index) => (
              <li key={index} className="min-w-[11rem] md:min-w-[13rem]">
                <Product
                  name={name}
                  product={product}
                  available={product.available}
                  category={category}
                  originalPrice={price}
                  discountedPrice={discountedPrice}
                  image={mainImage}
                  id={_id}
                // onAddToCart={handleAddToCart}
                />
              </li>
            ))}
          </section>
        )}
      </Wrapper>
    </>
  );
};

export default ProductsGrid;
