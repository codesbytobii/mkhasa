// "use client";

// import { ListGrid } from "../../components/ui/ListGrid";
// import BrandHero from "./components/BrandHero";
// import useBrand from "./hooks/useBrand";
// import { Product } from "../../components/ProductCard";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import LoadingSpinner from "../../components/LoadingSpinner";

// const SingleBrandProduct = ({
//     initialBrandName = "",
//     initialBrandData = null,
//     initialBrandDetails = null,
// }) => {
//     const params = useParams();
//     const routeBrandName = params?.brandName;
//     const brandName = initialBrandName || routeBrandName;
//     const { displayedProducts, lastProductRef, sorts, handleSort, brandsProductsData, loading } = useBrand({
//         initialData: initialBrandData,
//         initialBrandName: brandName,
//     });
//     const [brandDetails, setBrandDetails] = useState(initialBrandDetails);
//     const [isLoading, setIsLoading] = useState(!initialBrandDetails && !initialBrandData);
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

//     // Fetch brand details for hero section
//     useEffect(() => {
//         const fetchBrandDetails = async () => {
//             try {
//                 const response = await axios(`${baseUrl}/product/brand/${brandName}`);
//                 setBrandDetails(response.data);
//             } catch (error) {
//                 console.error("Error fetching brand details:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (brandName && !initialBrandDetails) {
//             fetchBrandDetails();
//         } else {
//             setIsLoading(false);
//         }
//     }, [brandName, baseUrl, initialBrandDetails]);

//     if (isLoading && !brandsProductsData && !initialBrandData) {
//         return <LoadingSpinner />;
//     }

//     return (
//         <>
//             <div className="px-2">
//                 <BrandHero brandName={brandName} brandDetails={brandDetails} />
                
//                 <section className="mb-8 flex-wrap flex gap-4 justify-between items-center">
//                     <span>
//                         {brandsProductsData?.totalProducts || initialBrandData?.totalProducts || 0}{" "}
//                         <span className="font-bold">Results</span> for {decodeURIComponent(brandName)}
//                     </span>
//                     <select 
//                         onChange={(e) => { handleSort(e.target.value) }} 
//                         className="flex items-center justify-between w-[200px] border px-4 py-2 rounded-md shadow-sm focus:outline-none placeholder:text-sm text-sm"
//                         defaultValue=""
//                     >
//                         <option value="all" className="text-sm placeholder:text-sm">Best Match</option>
//                         {sorts.map((category, index) => (
//                             <option value={category.part} key={index} className="capitalize text-sm placeholder:text-sm">
//                                 {category.name}
//                             </option>
//                         ))}
//                     </select>
//                 </section>

//                 <ListGrid>
//                     {displayedProducts?.map((product, index) => {
//                         // Handle different possible data structures
//                         const productData = product.product || product;
//                         return (
//                             <li 
//                                 key={productData._id || index} 
//                                 ref={index === displayedProducts?.length - 2 ? lastProductRef : null} 
//                                 className="min-w-[11rem] md:min-w-[13rem]"
//                             >
//                                 <Product
//                                     name={productData.name}
//                                     product={productData.name}
//                                     category={productData.category}
//                                     originalPrice={productData.price}
//                                     discountedPrice={productData.discountedPrice}
//                                     image={productData.mainImage}
//                                     id={productData._id}
//                                     available={productData.available}
//                                 />
//                             </li>
//                         );
//                     })}
//                 </ListGrid>
                
//                 {loading && (
//                     <div className="text-center py-4">
//                         <span>Loading more products...</span>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default SingleBrandProduct;

"use client";

import { ListGrid } from "../../components/ui/ListGrid";
import BrandHero from "./components/BrandHero";
import useBrand from "./hooks/useBrand";
import { Product } from "../../components/ProductCard";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Globe } from "lucide-react";

const SingleBrandProduct = ({
    initialBrandName = "",
    initialBrandData = null,
    initialBrandDetails = null,
}) => {
    const params = useParams();
    const routeBrandName = params?.brandName;
    const brandName = initialBrandName || routeBrandName;
    const { displayedProducts, lastProductRef, sorts, handleSort, brandsProductsData, loading } = useBrand({
        initialData: initialBrandData,
        initialBrandName: brandName,
    });
    const [brandDetails, setBrandDetails] = useState(initialBrandDetails);
    const [isLoading, setIsLoading] = useState(!initialBrandDetails && !initialBrandData);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        const fetchBrandDetails = async () => {
            try {
                const response = await axios(`${baseUrl}/product/brand/${brandName}`);
                setBrandDetails(response.data);
            } catch (error) {
                console.error("Error fetching brand details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (brandName && !initialBrandDetails) {
            fetchBrandDetails();
        } else {
            setIsLoading(false);
        }
    }, [brandName, baseUrl, initialBrandDetails]);

    if (isLoading && !brandsProductsData && !initialBrandData) {
        return <LoadingSpinner />;
    }

    const description = brandDetails?.description || brandDetails?.brand?.description;
    const website = brandDetails?.websiteUrl || brandDetails?.brand?.websiteUrl;
    const hasDescription = description && description.trim() !== "" && description !== "<p><br></p>";
    const hasWebsite = website && website.trim() !== "";

    return (
        <>
            <div className="px-2">
                <BrandHero brandName={brandName} brandDetails={brandDetails} />

                {/* Brand description and website — only shown if present */}
                {(hasDescription || hasWebsite) && (
                    <section className="mb-8 border-b border-gray-100 pb-8">
                        {hasDescription && (
                            <div
                                className="prose prose-sm max-w-none text-gray-700 mb-4"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}
                        {hasWebsite && (
                            <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                {website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </section>
                )}

                <section className="mb-8 flex-wrap flex gap-4 justify-between items-center">
                    <span>
                        {brandsProductsData?.totalProducts || initialBrandData?.totalProducts || 0}{" "}
                        <span className="font-bold">Results</span> for {decodeURIComponent(brandName)}
                    </span>
                    <select
                        onChange={(e) => { handleSort(e.target.value) }}
                        className="flex items-center justify-between w-[200px] border px-4 py-2 rounded-md shadow-sm focus:outline-none placeholder:text-sm text-sm"
                        defaultValue=""
                    >
                        <option value="all" className="text-sm placeholder:text-sm">Best Match</option>
                        {sorts.map((category, index) => (
                            <option value={category.part} key={index} className="capitalize text-sm placeholder:text-sm">
                                {category.name}
                            </option>
                        ))}
                    </select>
                </section>

                <ListGrid>
                    {displayedProducts?.map((product, index) => {
                        const productData = product.product || product;
                        return (
                            <li
                                key={productData._id || index}
                                ref={index === displayedProducts?.length - 2 ? lastProductRef : null}
                                className="min-w-[11rem] md:min-w-[13rem]"
                            >
                                <Product
                                    name={productData.name}
                                    product={productData.name}
                                    category={productData.category}
                                    originalPrice={productData.price}
                                    discountedPrice={productData.discountedPrice}
                                    image={productData.mainImage}
                                    id={productData._id}
                                    available={productData.available}
                                />
                            </li>
                        );
                    })}
                </ListGrid>

                {loading && (
                    <div className="text-center py-4">
                        <span>Loading more products...</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default SingleBrandProduct;
