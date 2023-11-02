import { useState } from 'react';
import Form from './Form';
import CodeEditor from './CodeEditor';
import { 
  Container,
  Col,
  Row,
  Button
} from 'reactstrap';

const App = () => {
  const [chainName, setChainName] = useState("");
  const [chainId, setChainId] = useState("");
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [spiderType, setSpiderType] = useState("chain");
  const [website, setWebsite] = useState("");

  const cleanAll = () => {
    setChainName("");
    setChainId("")
    setCategories([])
    setCountries([])
    setSpiderType("chain")
    setWebsite("")
  }

  return (
    <Container >
      <Row>
        <Col>
          <Form
            chainName={chainName}
            chainId={chainId}
            categories={categories}
            countries={countries}
            spiderType={spiderType}
            website={website}
            setChainName={setChainName}
            setChainId={setChainId}
            setCategories={setCategories}
            setCountries={setCountries}
            setSpiderType={setSpiderType}
            setWebsite={setWebsite}
          />
          <Button onClick={cleanAll}>Clean</Button>
        </Col>
        <Col>
          <CodeEditor
            chainName={chainName}
            chainId={chainId}
            categories={categories}
            countries={countries}
            spiderType={spiderType}
            website={website}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;