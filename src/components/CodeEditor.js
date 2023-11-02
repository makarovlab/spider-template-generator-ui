import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";


const spiderMetaGeneric = ({
    spiderType,
    categories,
    countries,
}) => `
    name = ""
    spider_type = "${spiderType ? spiderType : ""}"
    spider_categories = [
        ${categories ? categories.map(item => `Code.${item}.value`).join(",\n        ") : "\r"}
    ]
    spider_countries = [
        ${countries ? countries.map(item => `pycountry.countries.lookup("${item}").alpha_3`).join(",\n        ") : "\r"}
    ]
`

const spiderMetaChain = ({
    chainName,
    chainId,
    spiderType,
    categories,
    countries,
}) => `
    name = "${chainName ? `${chainName.toLowerCase().replace("\n", "").replace(/ +/g, "_")}${countries.length > 0 ? countries.map(cur => `_${cur.toLowerCase()}`).join("") : ""}_dpa` : ""}"
    brand_name = "${chainName ? chainName.replace("\n", "").replace(/ +/g, " ") : ""}"
    spider_type = "${spiderType ? spiderType : ""}"
    spider_chain_id = "${chainId ?  chainId : ""}"
    spider_categories = [
        ${categories ? categories.map(item => `Code.${item}.value`).join(",\n        ") : "\r"}
    ]
    spider_countries = [
        ${countries ? countries.map(item => `pycountry.countries.lookup("${item}").alpha_3`).join(",\n        ") : "\r"}
    ]
`

const spiderTemplate = ({
    chainName,
    chainId,
    spiderType,
    website,
    countries,
    categories,
}) => `
# -*- coding: utf-8 -*-

import scrapy
import pycountry
import uuid
from locations.categories import Code
from locations.items import GeojsonPointItem


class ${chainName && chainName.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').replace("\n", "").replace(/ +/g, "")}Spider(scrapy.Spider):
    ${
        spiderType === "chain"
        ? spiderMetaChain({chainName, chainId, spiderType, countries, categories})
        : spiderMetaGeneric({spiderType, countries})
    }
    # start_urls = ["${website ? website : ""}"]

    def start_requests(self):
        yield scrapy.Request(
            url="",
            method="GET",
            callback=self.parse,
        )

    def parse(self, response):
        list_of_places = response.json()
        
        for place in list_of_places:
            mappedAttributes = {
                'chain_name': self.brand_name,
                'chain_id': self.spider_chain_id,
                'ref': uuid.uuid4().hex,
                'addr_full': "",
                'city': "",
                'state': "",
                'postcode': "",
                'phone': "",
                'email': "",
                'opening_hours': "",
                'website': "${website ? website : ""}",
                'lat': "",
                'lon': "",
            }

            yield GeojsonPointItem(**mappedAttributes)
`

const CodeEditor = (props) => {
    const {
        chainName,
        chainId,
        categories,
        countries,
        spiderType,
        website,
    } = props;

    
    const chainNameParsed = chainName ? chainName.label.split("::")[1].trim() : "";
    const countriesParsed = countries.map(item => item.value);
    const categoriesParsed = categories.map(item => item.label.toUpperCase().replaceAll(" ", "_").replaceAll("-", "_"));

    const templateArgs = {
        chainId: chainId,
        chainName: chainNameParsed,
        spiderType: spiderType,
        countries: countriesParsed,
        categories: categoriesParsed,
        website: website,
    };

    return (
        <AceEditor
            width="600px"
            height="800px"
            mode="python"
            theme="monokai"
            fontSize={14}
            value={spiderTemplate(templateArgs)}
        />
    )
}

export default CodeEditor;