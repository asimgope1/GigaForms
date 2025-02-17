import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {DataTable} from 'react-native-paper';
import {BLACK, WHITE} from '../../constants/color';
import {HEIGHT} from '../../constants/config';

interface DataTableComponentProps {
  title: string;
  items: any[];
  page: number;
  itemsPerPage: number;
  setPage: (newPage: number) => void;
  from: number;
  to: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const DataTableComponent: React.FC<DataTableComponentProps> = ({
  title,
  items,
  page,
  itemsPerPage,
  setPage,
  from,
  to,
  onItemsPerPageChange,
}) => {
  const columns = items.length > 0 ? Object.keys(items[0]) : [];

  return (
    <View
      style={{
        width: '99%',
        padding: 5,
        backgroundColor: WHITE,
        elevation: 6,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        height: HEIGHT * 0.3,
        margin: 5,
      }}>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
          color: BLACK,
        }}>
        {title}
      </Text>

      {/* Check if data is available */}
      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: HEIGHT * 0.2,
          }}>
          <Text style={{fontSize: 16, color: '#999'}}>No Data Found</Text>
        </View>
      ) : (
        <ScrollView horizontal>
          <DataTable style={{borderWidth: 1, borderColor: '#ddd'}}>
            {/* Table Header */}
            <DataTable.Header
              style={{
                borderBottomWidth: 2,
                borderBottomColor: '#000',
                backgroundColor: '#f4f4f4',
              }}>
              {columns.map((col, index) => (
                <DataTable.Title
                  key={index}
                  numeric={index !== 0}
                  style={{
                    borderRightWidth: 1,
                    borderRightColor: '#ddd',
                    padding: 10,
                    width: 120, // Ensure all columns have a fixed width
                    textAlign: 'center', // Center align the text in headers
                  }}>
                  {col.replace(/_/g, ' ')} {/* Column name formatting */}
                </DataTable.Title>
              ))}
            </DataTable.Header>

            {/* Table Rows */}
            {items.slice(from, to).map((item, rowIndex) => (
              <DataTable.Row
                key={rowIndex}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#ddd',
                  backgroundColor: rowIndex % 2 === 0 ? '#fafafa' : 'white', // Alternate row color for readability
                }}>
                {columns.map((col, colIndex) => (
                  <DataTable.Cell
                    key={colIndex}
                    numeric={colIndex !== 0}
                    style={{
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                      padding: 10,
                      width: 120, // Ensure all cells have the same fixed width
                      textAlign: 'center', // Center align the text in cells
                    }}>
                    {String(item[col] ?? '-')}{' '}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      )}

      {/* Pagination */}
      {items.length > 0 && (
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={setPage}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      )}

      <View style={{height: 50}} />
    </View>
  );
};

export default DataTableComponent;
