import React from 'react';
import ItemPatterns from '../../util/ItemPatterns';

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleItemActivated = this.handleItemActivated.bind(this);
  }

  handleItemActivated(itemIndex) {
    this.props.itemActivated(itemIndex + 1);
  }

  render() {
    const imagePath = process.env.REACT_APP_IMAGE_PATH;

    return (
      <li>
        <div
          className={ItemPatterns[this.props.item].cost <= this.props.playerMoney ? 'active' : ''}
          onClick={() => this.handleItemActivated(this.props.index)} >
          <img src={`${imagePath}/${ItemPatterns[this.props.item].img}`} /> 
        </div>
        <p>{ItemPatterns[this.props.item].name}</p>
        <p>{ItemPatterns[this.props.item].cost}</p>
      </li>
    );
  }
}

export default Item;
