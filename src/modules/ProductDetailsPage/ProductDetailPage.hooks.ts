import { useContext, useEffect, useState } from 'react';
import { ProductDetailContext } from '../../ProductDetailContext';
import { ProductDetail } from '../../types/ProductDetail';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getProductDetailId,
  ProductCatalogContext,
} from '../../ProductCatalogContext';

export function useSelectedProductDetail() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  const category = pathSegments[0] || '';
  const itemId = pathSegments[1];

  const {
    products,
    statuses: { [category]: status = '' },
    reloadProducts,
  } = useContext(ProductDetailContext);

  const { loaded: loadedProductCatalog, productDetailIdToProductId } =
    useContext(ProductCatalogContext);

  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null,
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    });
  }, [pathname]);

  useEffect(() => {
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
    if (!status) {
      reloadProducts(category);
    }
  }, [status, products, category, reloadProducts]);

  useEffect(() => {
    if (status === 'loaded' && products[category]) {
      const currentPageProduct =
        products[category].find(product => product.id === itemId) || null;

      if (currentPageProduct) {
        setProductDetail(currentPageProduct);
      } else {
        setProductDetail(null);
        navigate('/404');
      }
    }
  }, [status, products, category, itemId, navigate]);

  return {
    productDetail,
    loading: !status || status === 'loading',
    error: status === 'error',
  };
}
