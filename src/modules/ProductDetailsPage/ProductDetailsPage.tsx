import styles from './ProductDetailsPage.module.scss';

import { useTranslation } from 'react-i18next';

import Breadcrumbs from '../shared/Breadcrumbs';
import { useSelectedProductDetail } from './ProductDetailPage.hooks';
import ProductDetailMain from './ProductDetailMain';
import ProductDetailBottom from './ProductDetailBottom';
import { ProductCatalogItem } from '../../types/ProductCatalogItem';
import { SLIDER_COUNT } from '../constants';
import { useContext } from 'react';
import { ProductCatalogContext } from '../../ProductCatalogContext';
import CatalogSlider from '../shared/CatalogSlider';
import BackButton from '../shared/BackButton';

function getSuggestedProducts(
  products: ProductCatalogItem[],
  itemId: string,
): ProductCatalogItem[] {
  if (!products.length) {
    return [];
  }

  const maxId = products[products.length - 1].id;
  const uniqueIds = new Set<number>();

  while (uniqueIds.size < SLIDER_COUNT + 1) {
    const randomNumber = Math.floor(Math.random() * maxId) + 1;

    uniqueIds.add(randomNumber);
  }

  return Array.from(uniqueIds)
    .map(num => products[num])
    .filter(product => product.itemId !== itemId)
    .slice(0, SLIDER_COUNT);
}

export const ProductDetailsPage = () => {
  const { t } = useTranslation();
  const { products: catalogProducts } = useContext(ProductCatalogContext);
  const { productDetail, loading, error } = useSelectedProductDetail();

  return (
    <div className="container">
      <Breadcrumbs lastSegment={productDetail?.name} />
      {loading && <p>Loading</p>}
      {error && <p>error</p>}
      {productDetail && (
        <>
          <BackButton />
          <h1 className={styles.productDetail__title}>{productDetail.name}</h1>
          <ProductDetailMain product={productDetail} />
          <ProductDetailBottom product={productDetail} />
        </>
      )}
      {productDetail && catalogProducts.length > 0 && (
        <CatalogSlider
          title={t('product-detail.may_like')}
          products={getSuggestedProducts(
            catalogProducts,
            productDetail?.id || '',
          )}
          additionalStyles={styles.productDetail__slider_marginTop}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
