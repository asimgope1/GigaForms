import React, {useMemo, useEffect} from 'react';
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
  // console.log('🟢 Items received:', items.length);
  // console.log(
  //   `📌 Page: ${page}, Items Per Page: ${itemsPerPage}, From: ${from}, To: ${to}`,
  // );

  // Extract table column names from the first item
  const columns = useMemo(() => {
    if (items.length > 0) {
      // console.log('🔵 Columns detected:', Object.keys(items[0]));
      return Object.keys(items[0]);
    }
    return [];
  }, [items]);

  // Ensure `to` doesn't exceed `items.length`
  const validTo = Math.min(to, items.length);
  const ignoredKeys = ['all_form_id', 'user_id', 'template_id'];
  const filteredColumns = useMemo(
    () => columns.filter(col => !ignoredKeys.includes(col)),
    [columns],
  );

  // Get visible items based on pagination
  const visibleItems = useMemo(() => {
    const slicedItems = items.slice(from, validTo);
    // console.log('🟠 Visible Items:', slicedItems.length);
    return slicedItems;
  }, [items, from, validTo]);

  // Effect to track updates in items and reset pagination if needed
  useEffect(() => {
    // console.log('🟡 Items updated:', items.length);
    if (items.length > 0 && from >= items.length) {
      console.log('⚠️ Adjusting pagination due to new data');
      setPage(0);
    }
  }, [items]);

  return (
    <View
      style={{
        width: '99%',
        padding: 10,
        backgroundColor: WHITE,
        elevation: 6,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        // height: HEIGHT * 0.3,
        margin: 5,
        marginBottom: 10,
      }}>
      <Text
        style={{
          // alignSelf: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
          color: BLACK,
        }}>
        {title}
      </Text>

      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // height: HEIGHT * 0.2,
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
              {columns
                .filter(
                  col =>
                    !['all_form_id', 'user_id', 'template_id'].includes(col),
                )
                .map((col, index) => (
                  <DataTable.Title
                    key={index}
                    numeric={index !== 0}
                    style={{
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                      padding: 10,
                      width: 120,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{textAlign: 'center', fontWeight: 'bold'}}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {col === 'max' ? 'Stage' : col.replace(/_/g, ' ')}
                    </Text>
                  </DataTable.Title>
                ))}
            </DataTable.Header>

            {/* Table Rows */}
            {visibleItems.map((item, rowIndex) => (
              <DataTable.Row
                key={rowIndex}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#ddd',
                  backgroundColor: rowIndex % 2 === 0 ? '#fafafa' : 'white',
                }}>
                {filteredColumns.map((col, colIndex) => (
                  <DataTable.Cell
                    key={colIndex}
                    numeric={colIndex !== 0}
                    style={{
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                      padding: 10,
                      width: 120,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{textAlign: 'center', color: BLACK}}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {String(item[col] ?? '-')}
                    </Text>
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
          label={`${from + 1}-${validTo} of ${items.length}`}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      )}
    </View>
  );
};

export default DataTableComponent;
