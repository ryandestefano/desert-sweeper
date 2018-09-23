import React from 'react';
import ItemPatterns from '../../util/ItemPatterns';
import Item from '../Item/Item';

class Shop extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Items = Object.keys(ItemPatterns);

    return (
      <div className="shop">
        <h3>Shop</h3>
        <ul>
          {Items.map((item, index) => {
            return (
              <Item item={item} index={index} itemActivated={this.props.itemActivated} playerMoney={this.props.playerMoney} />
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Shop;
