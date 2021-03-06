import React from 'react';

class Gem extends React.Component {
  constructor(props) {
    super(props);
    this.handleGemClick = this.handleGemClick.bind(this);
  }

  handleGemClick() {
    this.props.gemClick(this.props.row, this.props.column);
  }

  render() {
    const imagePath = process.env.REACT_APP_IMAGE_PATH;
    return (
      <img src={`${imagePath}/gem.gif`} onClick={this.handleGemClick} />
    );
  }
}

export default Gem;
