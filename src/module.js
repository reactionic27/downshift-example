import React from 'react';
import Downshift from 'downshift';
import ReactHtmlParser from 'react-html-parser';
import {
  Label,
  Menu,
  ControllerButton,
  Input,
  Tag,
  Item,
  ArrowIcon,
  XIcon,
  css,
  getFormatedText,
} from './shared';
import Axios from './axios';

const baseEndpoint = 'http://integration-equipment-defin-nlb-e31e032739595adb.elb.us-east-1.amazonaws.com/modules/index';

class ModuleAutoComplete extends React.Component {
  // getFormatedText = (title) => {
  //   return title.replace('<em>', '<em style="font-weight: bold; font-style: normal">')
  // }
  render() {
    return (
      <div
        {...css({
          display: 'flex',
          flexDirection: 'column',
          marginTop: 50,
        })}
      >
        <Downshift>
          {({
            inputValue,
            getInputProps,
            getLabelProps,
            getMenuProps,
            getItemProps,
            getToggleButtonProps,
            selectedItem,
            highlightedIndex,
            isOpen,
            clearSelection,
          }) => {
            return (
              <div {...css({width: 400, margin: 'auto', position: 'relative'})}>
                <Label {...getLabelProps()}>MODULE</Label>
                <div {...css({position: 'relative'})}>
                  <Input
                    {...getInputProps({
                      isOpen,
                      placeholder: '- Type to replace Module -',
                    })}
                  />
                  {selectedItem ? (
                    <ControllerButton
                      onClick={clearSelection}
                      aria-label="clear selection"
                    >
                      <XIcon />
                    </ControllerButton>
                  ) : (
                    <ControllerButton {...getToggleButtonProps()}>
                      <ArrowIcon isOpen={isOpen} />
                    </ControllerButton>
                  )}
                </div>
                <Menu {...getMenuProps({isOpen})}>
                  {(() => {
                    if (!isOpen) {
                      return null
                    }

                    if (!inputValue) {
                      return (
                        <Item disabled>You have to enter a search query</Item>
                      )
                    }

                    return (
                      <Axios url={baseEndpoint} params={{ query: inputValue }}>
                        {({loading, error, data}) => {
                          if (loading) {
                            return <Item disabled>Loading...</Item>
                          }

                          if (error) {
                            return <Item disabled>Error! ${error}</Item>
                          }
                          if (data && !data.length) {
                            return <Item disabled>No module found</Item>
                          }

                          return data ? data.map(({id, title, dateCreated, tags}, index) => (
                            <Item
                              key={id}
                              {...getItemProps({
                                item: title,
                                index,
                                isActive: highlightedIndex === index,
                                isSelected: selectedItem === title,
                              })}
                            >
                              <div>{ReactHtmlParser(getFormatedText(title))}</div>
                              <div style={{ marginTop: '5px'}}>
                                <Tag>
                                  {ReactHtmlParser(getFormatedText(tags['Cell Type']))}
                                </Tag>
                                <Tag>
                                  {ReactHtmlParser(getFormatedText(tags['Efficiency']))}
                                </Tag>
                                <Tag>
                                  {ReactHtmlParser(getFormatedText(tags['Efficiency Rank']))}
                                </Tag>
                                <Tag>
                                  {ReactHtmlParser(getFormatedText(tags['Efficiency Rating']))}
                                </Tag>
                                <Tag>
                                  {ReactHtmlParser(getFormatedText(tags['Frame and backsheet color']))}
                                </Tag>
                                <Tag>
                                  {ReactHtmlParser(getFormatedText(tags['Module Type']))}
                                </Tag>
                                <Tag>
                                  {ReactHtmlParser(getFormatedText(tags['Number of Cells']))}
                                </Tag>
                                <Tag>
                                  {ReactHtmlParser(getFormatedText(tags['Power Rating']))}
                                </Tag>
                              </div>
                              <div style={{ marginTop: '5px'}}>
                                {dateCreated}
                              </div>
                            </Item>
                          )) : null
                        }}
                      </Axios>
                    )
                  })()}
                </Menu>
              </div>
            )
          }}
        </Downshift>
      </div>
    )
  }
}

export default ModuleAutoComplete;
