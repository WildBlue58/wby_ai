import { Component } from "react";
import Child from "./Child";

class LifecycleDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };
  }
  // 状态，生命周期
  // JSX

  doIncrement = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };

  componentDidMount() {
    console.log("组件挂载了", this);
  }

  componentDidUpdate() {
    console.log("组件更新了", this);
  }

  componentWillUnmount() {
    console.log("组件要卸载了", this);
  }

  render() {
    return (
      <>
        <h1>LifecycleDemo</h1>
        <p>Count:{this.state.count}</p>
        <button onClick={this.doIncrement.bind(this)}>Increment</button>
        <Child title={"hello"} />
      </>
    );
  }
}

export default LifecycleDemo;
