import { useState, useRef } from 'react';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';

import { BiSearchAlt } from 'react-icons/bi';

// ==================================================

const useFilterSearch = (dataIndex, placeholderText) => {
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });

  const searchInput = useRef(null);

  // Tìm theo ký tự
  const searchHandler = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({ searchText: selectedKeys[0], searchedColumn: dataIndex });
  };

  const resetSearchHandler = (clearSearch, confirm) => {
    clearSearch();
    setSearch({ searchText: '', searchedColumn: '' });
    confirm();
  };

  // Render form và nút tìm kiếm
  const getColumnSearchProps = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          style={{
            marginBottom: 8,
            display: 'block',
          }}
          ref={searchInput}
          placeholder={placeholderText}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => searchHandler(selectedKeys, confirm, dataIndex)}
        />
        <Space>
          <Button
            style={{ width: '9rem' }}
            type='primary'
            size='small'
            icon={<BiSearchAlt />}
            onClick={() => searchHandler(selectedKeys, confirm, dataIndex)}
          >
            Search
          </Button>

          <Button
            style={{ width: '9rem' }}
            size='small'
            onClick={() =>
              clearFilters && resetSearchHandler(clearFilters, confirm)
            }
          >
            Reset
          </Button>

          <Button type='link' size='small' onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <BiSearchAlt
        style={{ color: filtered ? '#1677ff' : undefined }}
        size={18}
      />
    ),

    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

    render: (text) =>
      search.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
          }}
          searchWords={[search.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  return getColumnSearchProps();
};

export default useFilterSearch;
