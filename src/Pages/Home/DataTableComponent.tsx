import React from 'react';
import {View, Text} from 'react-native';
import {DataTable} from 'react-native-paper';
import {BLACK, WHITE} from '../../constants/color';
import {HEIGHT} from '../../constants/config';

interface DataTableComponentProps {
  title: string; // Header of the table
  items: any[]; // Data to display in the table
  columns: string[]; // Column headers
  page: number; // Current page for pagination
  itemsPerPage: number; // Items per page
  setPage: (newPage: number) => void; // Function to set page
  from: number; // Starting index for pagination
  to: number; // Ending index for pagination
  onItemsPerPageChange: (itemsPerPage: number) => void; // Function to change items per page
}

const DataTableComponent: React.FC<DataTableComponentProps> = ({
  title,
  items,
  columns,
  page,
  itemsPerPage,
  setPage,
  from,
  to,
  onItemsPerPageChange,
}) => {
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
      {/* Header for Table */}
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

      {/* DataTable */}
      <DataTable>
        <DataTable.Header>
          {columns.map((col, index) => (
            <DataTable.Title key={index} numeric={index !== 0}>
              {col}
            </DataTable.Title>
          ))}
        </DataTable.Header>

        {items.slice(from, to).map((item, index) => (
          <DataTable.Row key={index}>
            {columns.map((col, colIndex) => (
              <DataTable.Cell key={colIndex} numeric={colIndex !== 0}>
                {item[col.toLowerCase()]}{' '}
                {/* Dynamically display based on column name */}
              </DataTable.Cell>
            ))}
          </DataTable.Row>
        ))}

        {/* Pagination */}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={newPage => setPage(newPage)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>

      {/* Spacing Below */}
      <View style={{height: 50}} />
    </View>
  );
};

export default DataTableComponent;
