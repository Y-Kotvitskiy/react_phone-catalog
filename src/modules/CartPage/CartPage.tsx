import styles from './CartPage.module.scss';
import svgStringMinus from './../shared/assets/Icons/minus.svg?raw';
import svgStringPlus from './../shared/assets/Icons/plus.svg?raw';

import { useTranslation } from 'react-i18next';

import BackButton from '../shared/BackButton';
import { Link } from 'react-router-dom';
import { CURRENCY_SYMBOL } from '../constants';
import Button from '../shared/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { itemsActions } from '../../store/index';

const CartPage = () => {
  const { t } = useTranslation();

  const items = useAppSelector(state => state.items);
  const dispatch = useAppDispatch();

  const cartProducts = Object.values(items);

  const totalPrice = cartProducts.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const totalAmount = cartProducts.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const totalMessage = t('cart.items', { count: totalAmount });

  return (
    <div className="container">
      <BackButton />
      <div className={styles.cart}>
        <h1 className={styles.cart__title}>{t(`cart.title`)}</h1>

        {totalAmount !== 0 && (
          <ul className={styles.cart__items}>
            {cartProducts.map(({ product }) => (
              <li key={product.id} className={styles.item}>
                <div className={styles.item__firstRow}>
                  <button
                    className={styles.item__buttonClose}
                    onClick={() =>
                      dispatch({ type: 'removeFromCart', payload: product.id })
                    }
                  ></button>
                  <Link
                    className={styles.item__photo}
                    to={`/${product.category}/${product.itemId}`}
                  >
                    <img
                      className={styles.item__image}
                      src={'/' + product.image}
                      alt={product.name}
                    />
                  </Link>
                  <Link
                    className={styles.item__productName}
                    to={`/${product.category}/${product.itemId}`}
                  >
                    {product.name}
                  </Link>
                </div>

                <div className={styles.item__secondRow}>
                  <div className={styles.itemAmount}>
                    <button
                      className={styles.itemAmount__button}
                      disabled={items[product.id].quantity === 1}
                      onClick={() => dispatch(itemsActions.remove(product))}
                      dangerouslySetInnerHTML={{ __html: svgStringMinus }}
                    ></button>
                    <p className={styles.itemAmount__value}>
                      {items[product.id].quantity}
                    </p>
                    <button
                      className={styles.itemAmount__button}
                      onClick={() => dispatch(itemsActions.add(product))}
                      dangerouslySetInnerHTML={{ __html: svgStringPlus }}
                    ></button>
                  </div>
                  <p className={styles.item__price}>
                    {CURRENCY_SYMBOL + product.price}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {totalAmount !== 0 && (
          <div className={styles.cart__total}>
            <p className={styles.cart__totalPrice}>
              {CURRENCY_SYMBOL + totalPrice}
            </p>
            <p className={styles.cart__totalAmount}>{totalMessage}</p>
            <div className={styles.cart__totalDivider}></div>
            <Button
              text={t('cart.checkout')}
              handleClick={() => dispatch(itemsActions.clear())}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
