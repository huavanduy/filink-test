import "./App.css";
import { Col, Row, Card, Input, Slider, Button } from "antd";
import React from "react";
import { loadDataApi } from "./axios/fundedApi";

// name, symbol, status, 2 slider totalRaise và personalAllocation

function App() {
  const { Meta } = Card;
  const [filter, setFilter] = React.useState({
    page: 1,
    pageSize: 8,
  });
  const [currentPage, setCurrentPage] = React.useState(1);

  const [dataRender, setDataRender] = React.useState([]);

  const loadData = async () => {
    const { data } = await loadDataApi(filter);
    if (data.statusCode === 1) {
      setDataRender(data.data.fundProjects);
    }
  };


  React.useEffect(() => {
    loadData();
  }, []);

  const renderTitleCart = (item) => {
    return (
      <>
        <div className="card-title">
          <p>{item.name}</p>
          <img src="https://i.ibb.co/0MN8m0v/Coin.png" />
        </div>
        <div className="card-body">
          <div>$BCMC</div>
          <div className="price">
            <p>Total Raise</p>
            <p className="money">${item.totalRaise} Max</p>
          </div>
          <div className="price">
            <p>Personal Allocation</p>
            <p className="money">${item.personalAllocation}</p>
          </div>
        </div>
      </>
    );
  };

  const handleClear = async () => {
    const clearFilter = {
      page: 1,
      pageSize: 8,
    };
    const { data } = await loadDataApi(clearFilter);
    if (data.statusCode === 1) {
      setDataRender(data.data.fundProjects);
    }
    setFilter(clearFilter);
  };

  const handleFilter = async () => {
    const { data } = await loadDataApi(filter);
    if (data.statusCode === 1) {
      setDataRender(data.data.fundProjects);
    }
  };

  const loadMore = async () => {
    const page = currentPage;
    const oldData = dataRender;
    setCurrentPage(page + 1);
    const { data } = await loadDataApi({
      pageSize: 8,
      page: currentPage,
    });
    if (data.statusCode === 1) {
      setDataRender([...oldData, ...data.data.fundProjects]);
    }
  };

  const renderFilter = () => {
    return (
      <>
        <div className="filter">
          <div className="filter-1">
            Name:{" "}
            <Input
              onChange={(e) => {
                setFilter({
                  ...filter,
                  name: e.target.value,
                });
              }}
            />
            Symbol:{" "}
            <Input
              onChange={(e) => {
                setFilter({
                  ...filter,
                  symbol: e.target.value,
                });
              }}
            />
            Status:{" "}
            <Input
              onChange={(e) => {
                setFilter({
                  ...filter,
                  status: e.target.value,
                });
              }}
            />
          </div>
          <div className="filter-2">
            <div className="range">
              Total Raise:
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={[20, 50]}
                value={filter.totalRaise}
                onAfterChange={(e) => {
                  setFilter({
                    ...filter,
                    totalRaise: e,
                  });
                }}
              />
              <Button
                onClick={() => {
                  handleClear();
                }}
                type="danger"
              >
                Clear
              </Button>
            </div>
            <div className="range">
              Personal Allocation:
              <Slider
                range={{ draggableTrack: true }}
                value={filter.personalAllocation}
                defaultValue={[20, 50]}
                onAfterChange={(e) => {
                  setFilter({
                    ...filter,
                    personalAllocation: e,
                  });
                }}
              />
              <Button onClick={() => handleFilter()} type="primary">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderTotal = () => {
    return (
      <>
        <div className="total">
          <Row gutter={[16, 16]}>
            <Col xl={8} md={12} xs={24}>
              <div className="content-total">
                <div className="content">
                  <img src="https://i.ibb.co/0MN8m0v/Coin.png" />
                  <p style={{ color: "#F0D042" }}>Total transactions:</p>
                </div>
                <div className="value">79</div>
              </div>
            </Col>
            <Col xl={8} md={12} xs={24}>
              <div className="content-total">
                <div className="content">
                  <img src="https://i.ibb.co/0MN8m0v/Coin.png" />
                  <p style={{ color: "#31B4D9" }}>AVG of block time:</p>
                </div>
                <div className="value">19.455</div>
              </div>
            </Col>
            <Col xl={8} md={12} xs={24}>
              <div className="content-total">
                <div className="content">
                  <img src="https://i.ibb.co/0MN8m0v/Coin.png" />
                  <p style={{ color: "#1F8B24" }}>AVG of ETH/transactions</p>
                </div>
                <div className="value">1.10 ETH</div>
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <div className="layout-container">
        <div className="main-title">
          <div className="title">2nd largest of Transactions:</div>
          <div className="sub-title">1.10 ETH</div>
        </div>
        {renderTotal()}
        {renderFilter()}
        <Row gutter={[32, 32]}>
          {dataRender != []
            ? dataRender.map((item, index) => {
                return (
                  <Col xl={6} md={12} xs={24} key={index}>
                    <Card
                      hoverable
                      cover={<img alt="example" src={item.coverPhoto} />}
                    >
                      <Meta
                        title={renderTitleCart(item)}
                        description="IDO starts on October 14th 2021"
                      />
                    </Card>
                  </Col>
                );
              })
            : ""}
        </Row>
        <Button
          className="load-more"
          onClick={() => {
            loadMore();
          }}
        >
          Load More
        </Button>
      </div>
    </div>
  );
}

export default App;
