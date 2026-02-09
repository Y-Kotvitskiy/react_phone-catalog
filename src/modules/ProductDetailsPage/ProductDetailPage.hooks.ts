import { useContext, useEffect, useState } from 'react';
import { ProductDetailContext } from '../../ProductDetailContext';
import { ProductDetail } from '../../types/ProductDetail';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getProductDetailId,
  ProductCatalogContext,
} from '../../ProductCatalogContext';

export function useSelectedProductDetail() {
  const {
    products,
    loading,
    loaded: loadedProductDetail,
    error,
    reloadProducts,
  } = useContext(ProductDetailContext);

  const { loaded: loadedProductCatalog, productDetailIdToProductId } =
    useContext(ProductCatalogContext);
  const [pageProducts, setProducts] = useState<ProductDetail[] | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null,
  );

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  const category = pathSegments[0];
  const itemId = pathSegments[1];

  useEffect(() => {
    debugger;
    if (
      itemId &&
      loadedProductCatalog &&
      !productDetailIdToProductId[getProductDetailId({ category, itemId })]
    ) {
      navigate('/404');
    }
  }, [
    navigate,
    category,
    loadedProductCatalog,
    productDetailIdToProductId,
    itemId,
  ]);

  useEffect(() => {
    if (loading) {
      return;
    }

    debugger;
    if (loadedProductDetail) {
      const currentPageProducts = products[category];

      if (!currentPageProducts) {
        reloadProducts(category);
      }

      setProducts(currentPageProducts);
    }
  }, [products, category, loading, loadedProductDetail, reloadProducts]);

  useEffect(() => {
    if (!loadedProductDetail || !pageProducts) {
      setProductDetail(null);
    } else {
      setProductDetail(
        pageProducts.find(product => product.id === itemId) || null,
      );
    }
  }, [pageProducts, itemId, loadedProductDetail]);

  return {
    productDetail,
    loading,
    error,
  };
}
