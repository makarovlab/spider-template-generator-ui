import { useState, useEffect } from 'react';
import Select from 'react-select';
import allChains from '../api/chains';
import allCategories from '../api/categories';
import allCountries from '../api/countries';
import styled from 'styled-components';
import { 
    Input,
} from 'reactstrap';

const InputContainer = styled.div`
    margin-bottom: 20px;
`

const Form = (props) => {
    const {
        chainName,
        categories,
        countries,
        website,
        spiderType,
        setChainName,
        setChainId,
        setCategories,
        setCountries,
        setSpiderType,
        setWebsite,
    } = props;
    
    const [chainsOptions, setChainsOptions] = useState([]);

    const onInputChainName = (value) => {
        
        const chainName = value.toLowerCase();
        const seenChains = new Set();
        const finalChains = [];

        if(chainName.length > 2) {
            const filtered_chains = allChains.filter(item => {
                return item.chainName.toLowerCase().includes(value.toLowerCase())
            });

            for (let chain of filtered_chains) {
                if(!seenChains.has(chain.chainId)) {
                    seenChains.add(chain.chainId);
                    finalChains.push(chain);
                }
            }
        }

        setChainsOptions(finalChains);
    }

    const onChangeChainName = (action) => {
        setChainId(action.value)
        // setChainName(action.label.split("::")[1].trim())
        setChainName(action)
    }

    const onChangeCountries = (action) => {
        console.log(action)
        setCountries(action)
    }

    const onChangeCategories = (action) => {
        console.log(action)
        // setCategories(action.map(item => item.label.toUpperCase().replaceAll(" ", "_")))
        setCategories(action)
    }

    return (
        <div style={{width: "400px"}}>
            <h4>Spider Metadata</h4>
            <InputContainer>
                <div>Spider Type</div>
                <Select
                    isClearable={false}
                    isSearchable={false}
                    defaultValue={{ value: 'chain', label: 'chain' }}
                    options={[
                        { value: 'chain', label: 'chain' },
                        { value: 'generic', label: 'generic' },
                    ]}
                    onChange={action => setSpiderType(action.value)}
                />
            </InputContainer>
            {
                spiderType === "chain" && 
                <InputContainer>
                    <div>Chain name</div>
                    <Select
                        isClearable={false}
                        isSearchable={true}
                        value={chainName}
                        onChange={onChangeChainName}
                        onInputChange={onInputChainName}
                        options={chainsOptions.map(item => ({ value: item.chainId, label: `${item.chainId} :: ${item.chainName}`}))}
                    />
                </InputContainer>
            }
            
            <InputContainer>
                <div>Categories</div>
                <Select
                    isClearable={true}
                    isSearchable={true}
                    isMulti={true}
                    value={categories}
                    onChange={onChangeCategories}
                    options={allCategories.map(item => ({ value: item.categoryId, label: item.categoryName }))}
                />
            </InputContainer>
            <InputContainer>
                <div>Countries</div>
                <Select
                    isClearable={true}
                    isSearchable={true}
                    isMulti={true}
                    value={countries}
                    onChange={onChangeCountries}
                    options={allCountries.map(item => ({ value: item.countryCode, label: item.countryName }))}
                />
            </InputContainer>
            <InputContainer>
                <div>Website</div>
                <Input
                    value={website}
                    onChange={evt => setWebsite(evt.target.value)}
                />
            </InputContainer>
            <h4>Spider Requests</h4>
            <InputContainer>
                <div>Request method</div>
                <Select
                    isClearable={false}
                    isSearchable={false}
                    defaultValue={{ value: 'GET', label: 'GET' }}
                    options={[
                        { value: 'GET', label: 'GET' },
                        { value: 'POST', label: 'POST' },
                    ]}
                />
            </InputContainer>
      </div>
    )
}

export default Form;