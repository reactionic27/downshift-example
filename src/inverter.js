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
} from './shared';
import Axios from './axios';

const baseEndpoint = 'http://integration-equipment-defin-nlb-e31e032739595adb.elb.us-east-1.amazonaws.com/inverters/index';

class InverterAutoComplete extends React.Component {
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
                <Label {...getLabelProps()}>INVERTER</Label>
                <div {...css({position: 'relative'})}>
                  <Input
                    {...getInputProps({
                      isOpen,
                      placeholder: '- Type to replace Inverter -',
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
                      <Axios
                        url={baseEndpoint}
                        params={{
                          query: inputValue,
                          temperatureAdjustedVmp: '30.0',
                          temperatureAdjustedVoc: '38',
                          voltage: '208',
                          mountingMethod: 'WALL_MOUNT'
                        }}>
                        {({loading, error, data}) => {
                          if (loading) {
                            return <Item disabled>Loading...</Item>
                          }
                          console.log('invert data', data);
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
                              <div style={{ fontWeight: 'bold' }}>{ReactHtmlParser(title)}</div>
                              <div style={{ marginTop: '5px'}}>
                                <Tag>
                                  {tags['AC power output']}
                                </Tag>
                                <Tag>
                                  {tags['Certification']}
                                </Tag>
                                <Tag>
                                  {tags['Inverter Type']}
                                </Tag>
                                <Tag>
                                  {tags['Maximum Operating Voltage']}
                                </Tag>
                                <Tag>
                                  {tags['Minimum Operating Voltage']}
                                </Tag>
                                <Tag>
                                  {tags['Mounting Method']}
                                </Tag>
                                <Tag>
                                  {tags['Output Voltage']}
                                </Tag>
                                <Tag>
                                  {tags['Storage']}
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

export default InverterAutoComplete;
