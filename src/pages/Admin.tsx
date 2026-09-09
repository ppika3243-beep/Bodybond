import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTab } from '../components/Admin/AdminAuth';
import { DashboardOverview } from '../components/Admin/DashboardOverview';
import { OrdersTable } from '../components/Admin/OrdersTable';
import { OrderDetailsModal, OrderItem } from '../components/Admin/OrderDetailsModal';
import { ProductManager } from '../components/Admin/ProductManager';
import { StoreSettings } from '../components/Admin/StoreSettings';
import { ExportOrders } from '../components/Admin/ExportOrders';
import { db, handleFirestoreError, OperationType } from '../utils/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData: OrderItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let formattedDate = 'Recent';
          if (data.createdAt?.toDate) {
            formattedDate = data.createdAt.toDate().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
          }

          return {
            id: docSnap.id,
            orderId: data.orderId || 'BB-UNKNOWN',
            customerName: data.customerName || 'Unknown Customer',
            phone: data.phone || '',
            address: data.address || '',
            area: data.area || 'Inside Dhaka',
            district: data.district || '',
            productId: data.productId || 'body-glue',
            productName: data.productName || 'BODYBOND Body Glue',
            quantity: Number(data.quantity) || 1,
            productPrice: Number(data.productPrice) || 950,
            deliveryCharge: typeof data.deliveryCharge === 'number' ? data.deliveryCharge : 0,
            totalAmount: Number(data.totalAmount) || 950,
            paymentMethod: data.paymentMethod || 'Cash on Delivery',
            orderStatus: data.orderStatus || 'Pending',
            notes: data.notes || '',
            adminNotes: data.adminNotes || '',
            date: formattedDate,
            createdAt: data.createdAt
          };
        });

        setOrders(ordersData);
        setLoading(false);

        // Keep selectedOrder in sync if modal is open
        if (selectedOrder) {
          const updated = ordersData.find(o => o.id === selectedOrder.id);
          if (updated) setSelectedOrder(updated);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedOrder?.id]);

  const handleStatusChange = async (orderDocId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderDocId), {
        orderStatus: newStatus
      });
      // Optimistically update selectedOrder if open
      if (selectedOrder && selectedOrder.id === orderDocId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderDocId}`);
    }
  };

  const pendingCount = orders.filter(o => o.orderStatus === 'Pending').length;

  return (
    <AdminLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      pendingCount={pendingCount}
      totalCount={orders.length}
    >
      <div className="space-y-6">
        {/* Tab Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-gray gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight">
              {activeTab === 'dashboard' && 'Operations Dashboard'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'products' && 'Product & Asset Manager'}
              {activeTab === 'settings' && 'Store Configuration'}
              {activeTab === 'export' && 'Order Data Export'}
            </h1>
            <p className="text-xs text-brand-gray-dark mt-0.5">
              {activeTab === 'dashboard' && 'Real-time performance metrics and recent customer activity.'}
              {activeTab === 'orders' && 'Track, filter, update status, and manage customer orders.'}
              {activeTab === 'products' && 'Update live pricing, availability, and URL-based image gallery.'}
              {activeTab === 'settings' && 'Configure Dhaka/Outside Dhaka delivery rates and contact details.'}
              {activeTab === 'export' && 'Download customer and order records in CSV format for spreadsheets.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-brand-gray-dark">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Firestore Sync</span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            orders={orders}
            loading={loading}
            onSelectOrder={setSelectedOrder}
            onNavigateTab={(tab, filter) => {
              setActiveTab(tab);
              if (filter) setStatusFilter(filter);
            }}
            onStatusChange={handleStatusChange}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTable
            orders={orders}
            loading={loading}
            onSelectOrder={setSelectedOrder}
            onStatusChange={handleStatusChange}
            initialStatusFilter={statusFilter}
          />
        )}

        {activeTab === 'products' && (
          <ProductManager />
        )}

        {activeTab === 'settings' && (
          <StoreSettings />
        )}

        {activeTab === 'export' && (
          <ExportOrders orders={orders} />
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </AdminLayout>
  );
}
