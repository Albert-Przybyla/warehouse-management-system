"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ViewKey =
  | "dashboard"
  | "products"
  | "stock"
  | "deliveries"
  | "orders"
  | "customers"
  | "suppliers"
  | "warehouses"
  | "search"
  | "admin"
  | "reports";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Page() {
  const [token, setToken] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [view, setView] = React.useState<ViewKey>("dashboard");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [health, setHealth] = React.useState("checking");

  const [loginForm, setLoginForm] = React.useState({ username: "", password: "" });
  const [productSearch, setProductSearch] = React.useState("");
  const [productForm, setProductForm] = React.useState({
    sku: "",
    name: "",
    type: "",
    brand: "",
    model: "",
  });
  const [productSkuSuggestion, setProductSkuSuggestion] = React.useState("");
  const [productModalOpen, setProductModalOpen] = React.useState(false);
  const [productEditForm, setProductEditForm] = React.useState({
    id: "",
    sku: "",
    name: "",
    type: "",
    brand: "",
    model: "",
  });
  const [productEditMessage, setProductEditMessage] = React.useState<string | null>(null);
  const [stockFilters, setStockFilters] = React.useState({
    warehouse_id: "",
    product_id: "",
    location_id: "",
  });
  const [stockTransferForm, setStockTransferForm] = React.useState({
    product_id: "",
    from_location_id: "",
    to_location_id: "",
    qty: "1",
  });
  const [stockFilterLookup, setStockFilterLookup] = React.useState({
    product: "",
    location: "",
  });
  const [stockTransferFilter, setStockTransferFilter] = React.useState({
    product: "",
    location: "",
  });
  const [deliveryStatus, setDeliveryStatus] = React.useState("");
  const [deliveryForm, setDeliveryForm] = React.useState({
    supplier_id: "",
    document_no: "",
    items: [{ sku: "", qty: "1", location_code: "" }],
  });
  const [deliveryWarehouseId, setDeliveryWarehouseId] = React.useState("");
  const [deliveryInProgress, setDeliveryInProgress] = React.useState<any[]>([]);
  const [deliveryPutawayForm, setDeliveryPutawayForm] = React.useState({
    delivery_id: "",
    items: [{ sku: "", qty: "1", location_code: "" }],
  });
  const [deliveryModalOpen, setDeliveryModalOpen] = React.useState(false);
  const [deliverySelected, setDeliverySelected] = React.useState<any | null>(null);
  const [deliveryItemsSummary, setDeliveryItemsSummary] = React.useState<any[]>([]);
  const [orderFilters, setOrderFilters] = React.useState({
    status: "",
    customer_id: "",
    priority: "",
  });
  const [orderForm, setOrderForm] = React.useState({
    order_no: "",
    customer_id: "",
    priority: false,
    items: [{ sku: "", qty: "1" }],
  });
  const [orderDetailId, setOrderDetailId] = React.useState("");
  const [orderSummary, setOrderSummary] = React.useState<any | null>(null);
  const [orderStatusUpdate, setOrderStatusUpdate] = React.useState("");
  const [orderQuickMessage, setOrderQuickMessage] = React.useState<string | null>(null);
  const [orderQuickId, setOrderQuickId] = React.useState("");
  const [orderQuickSummary, setOrderQuickSummary] = React.useState<any | null>(null);
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);
  const [orderSelected, setOrderSelected] = React.useState<any | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any | null>(null);
  const [orderAction, setOrderAction] = React.useState({
    order_id: "",
    priority: false,
  });
  const [lookups, setLookups] = React.useState({
    customers: [] as any[],
    suppliers: [] as any[],
    products: [] as any[],
    locations: [] as any[],
    warehouses: [] as any[],
  });
  const [customerForm, setCustomerForm] = React.useState({
    name: "",
    contact_data: "",
  });
  const [customerModalOpen, setCustomerModalOpen] = React.useState(false);
  const [customerEditForm, setCustomerEditForm] = React.useState({
    id: "",
    name: "",
    contact_data: "",
  });
  const [customerSelectSearch, setCustomerSelectSearch] = React.useState("");
  const [supplierForm, setSupplierForm] = React.useState({
    name: "",
    contact_data: "",
  });
  const [supplierModalOpen, setSupplierModalOpen] = React.useState(false);
  const [supplierEditForm, setSupplierEditForm] = React.useState({
    id: "",
    name: "",
    contact_data: "",
  });
  const [supplierSelectSearch, setSupplierSelectSearch] = React.useState("");
  const [customerSearch, setCustomerSearch] = React.useState("");
  const [supplierSearch, setSupplierSearch] = React.useState("");
  const [warehouseView, setWarehouseView] = React.useState({
    warehouse_id: "",
    location_id: "",
    is_blocked: false,
  });
  const [locationForm, setLocationForm] = React.useState({
    warehouse_id: "",
    code: "",
    description: "",
    kind: "RACK_CELL",
    is_blocked: false,
  });
  const [locationEditForm, setLocationEditForm] = React.useState({
    id: "",
    warehouse_id: "",
    code: "",
    description: "",
    kind: "",
    is_blocked: false,
  });
  const [locationFormMessage, setLocationFormMessage] = React.useState<string | null>(null);
  const [locationSelectSearch, setLocationSelectSearch] = React.useState("");
  const [layoutLock, setLayoutLock] = React.useState<any | null>(null);
  const [layoutLockMessage, setLayoutLockMessage] = React.useState<string | null>(null);
  const [warehouseList, setWarehouseList] = React.useState<any[]>([]);
  const [warehouseQuery, setWarehouseQuery] = React.useState({
    q: "",
    sort: "name",
    order: "asc",
  });
  const [warehouseSelected, setWarehouseSelected] = React.useState<any | null>(null);
  const [warehouseTab, setWarehouseTab] = React.useState("summary");
  const [warehouseDashboard, setWarehouseDashboard] = React.useState<any | null>(null);
  const [warehouseStock, setWarehouseStock] = React.useState<any[]>([]);
  const [warehouseStockQuery, setWarehouseStockQuery] = React.useState({
    q: "",
    page: 1,
    page_size: 20,
    sort: "qty",
    order: "desc",
  });
  const [warehouseStockTotal, setWarehouseStockTotal] = React.useState(0);
  const [warehouseProductLocations, setWarehouseProductLocations] = React.useState<any[]>([]);
  const [warehouseLocations, setWarehouseLocations] = React.useState<any[]>([]);
  const [warehouseLocationFilter, setWarehouseLocationFilter] = React.useState("");
  const [warehouseForm, setWarehouseForm] = React.useState({
    name: "",
    unit_scale: "1.0",
  });
  const [warehouseEditForm, setWarehouseEditForm] = React.useState({
    id: "",
    name: "",
    unit_scale: "",
  });
  const [warehouseFormMessage, setWarehouseFormMessage] = React.useState<string | null>(null);
  const [adminUserForm, setAdminUserForm] = React.useState({
    login: "",
    password: "",
    role: "MAGAZYNIER",
  });
  const [adminUpdateForm, setAdminUpdateForm] = React.useState({
    user_id: "",
    role: "MAGAZYNIER",
    is_active: true,
    password: "",
  });
  const [reportFilters, setReportFilters] = React.useState({
    action: "",
    user_id: "",
    status: "",
    supplier_id: "",
    customer_id: "",
    priority: "",
  });
  const [pagination, setPagination] = React.useState({ limit: 50, page: 1 });
  const tableContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const [reportType, setReportType] = React.useState("stock");

  const [data, setData] = React.useState<any[]>([]);
  const [productMessage, setProductMessage] = React.useState<string | null>(null);
  const [deliveryMessage, setDeliveryMessage] = React.useState<string | null>(null);
  const [orderMessage, setOrderMessage] = React.useState<string | null>(null);
  const [customerMessage, setCustomerMessage] = React.useState<string | null>(null);
  const [supplierMessage, setSupplierMessage] = React.useState<string | null>(null);
  const [adminMessage, setAdminMessage] = React.useState<string | null>(null);
  const [warehouseMessage, setWarehouseMessage] = React.useState<string | null>(null);
  const [stockTransferMessage, setStockTransferMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = window.localStorage.getItem("wms_token");
    const storedRole = window.localStorage.getItem("wms_role");
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/health`);
        if (!res.ok) throw new Error("Health check failed");
        setHealth("ok");
      } catch {
        setHealth("offline");
      }
    };
    checkHealth();
  }, []);

  React.useEffect(() => {
    if (!token) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, reportType]);

  React.useEffect(() => {
    if (view !== "products" || !productModalOpen) return;
    const suggestion = handleSuggestSku();
    setProductForm((prev) => ({
      ...prev,
      sku: prev.sku || suggestion,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, productModalOpen, data]);

  React.useEffect(() => {
    if (view !== "warehouses" || !warehouseSelected) return;
    handleLoadWarehouseDetails(String(warehouseSelected.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    view,
    warehouseSelected?.id,
    warehouseStockQuery.page,
    warehouseStockQuery.page_size,
    warehouseStockQuery.sort,
    warehouseStockQuery.order,
  ]);

  React.useEffect(() => {
    const updateHeight = () => {
      if (tableContainerRef.current) {
        setViewportHeight(tableContainerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  React.useEffect(() => {
    if (!token) return;
    const loadLookups = async () => {
      try {
        const [customers, suppliers, products, locations, warehouses] = await Promise.all([
          apiFetch("/customers"),
          apiFetch("/suppliers"),
          apiFetch("/products"),
          apiFetch("/locations"),
          apiFetch("/warehouses"),
        ]);
        setLookups({ customers, suppliers, products, locations, warehouses });
      } catch {
        // Ignore lookup failures; user can still type manually.
      }
    };
    if (view === "orders" || view === "deliveries" || view === "stock") {
      loadLookups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, token]);

  React.useEffect(() => {
    if (!token) return;
    const loadDeliveryItems = async () => {
      if (!deliveryPutawayForm.delivery_id) {
        setDeliveryItemsSummary([]);
        return;
      }
      try {
        const delivery = await apiFetch(`/deliveries/${deliveryPutawayForm.delivery_id}`);
        setDeliveryItemsSummary(Array.isArray(delivery.items) ? delivery.items : []);
      } catch {
        setDeliveryItemsSummary([]);
      }
    };
    loadDeliveryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryPutawayForm.delivery_id, token]);

  const apiFetch = async (path: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (!res.ok) {
      if (res.status === 401) {
        handleLogout();
      }
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    return res.text();
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      setToken(payload.access_token);
      setRole(payload.role);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("wms_token", payload.access_token);
        window.localStorage.setItem("wms_role", payload.role);
      }
      setView("dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const canManageProducts = role === "ADMIN" || role === "KIEROWNIK";
  const canManageDeliveries = role === "MAGAZYNIER" || role === "KIEROWNIK";
  const canCreateOrders = role === "ADMIN" || role === "KIEROWNIK";
  const canIssueOrders = role === "MAGAZYNIER" || role === "KIEROWNIK";
  const canManageOrderPriority = role === "KIEROWNIK";
  const canCancelOrders = role === "KIEROWNIK";
  const canManageCustomers = role === "ADMIN" || role === "KIEROWNIK";
  const canManageSuppliers = role === "ADMIN" || role === "KIEROWNIK";
  const canManageAdmin = role === "ADMIN";
  const canManageLocations = role === "ADMIN" || role === "KIEROWNIK";
  const canManageLocationsAdmin = role === "ADMIN";
  const canTransferStock = role === "MAGAZYNIER" || role === "KIEROWNIK";
  const canManageWarehouses = role === "ADMIN";

  const allowedViews = React.useMemo(() => {
    if (role === "ADMIN") {
      return new Set<ViewKey>([
        "dashboard",
        "products",
        "stock",
        "deliveries",
        "orders",
        "customers",
        "suppliers",
        "warehouses",
        "search",
        "admin",
        "reports",
      ]);
    }
    if (role === "KIEROWNIK") {
      return new Set<ViewKey>([
        "dashboard",
        "products",
        "stock",
        "deliveries",
        "orders",
        "customers",
        "suppliers",
        "warehouses",
        "search",
        "reports",
      ]);
    }
    if (role === "MAGAZYNIER") {
      return new Set<ViewKey>([
        "dashboard",
        "products",
        "stock",
        "deliveries",
        "orders",
        "warehouses",
        "search",
      ]);
    }
    return new Set<ViewKey>(["dashboard"]);
  }, [role]);

  React.useEffect(() => {
    if (!allowedViews.has(view)) {
      setView("dashboard");
    }
  }, [allowedViews, view]);

  const handleCreateProduct = async () => {
    setError(null);
    setProductMessage(null);
    setLoading(true);
    try {
      const payload = {
        ...productForm,
        sku: productForm.sku || productSkuSuggestion,
      };
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setProductMessage("Produkt dodany.");
      setProductForm({ sku: "", name: "", type: "", brand: "", model: "" });
      setProductModalOpen(false);
      setProductSkuSuggestion("");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac produktu");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: any) => {
    setProductEditMessage(null);
    setProductEditForm({
      id: String(product.id),
      sku: product.sku,
      name: product.name ?? "",
      type: product.type ?? "",
      brand: product.brand ?? "",
      model: product.model ?? "",
    });
  };

  const handleSuggestSku = () => {
    const existingSkus = Array.isArray(data)
      ? data.map((item: any) => item.sku).filter(Boolean)
      : [];
    const maxNumber = existingSkus.reduce((acc: number, sku: string) => {
      const match = /^SKU-(\d+)$/.exec(String(sku).toUpperCase());
      if (!match) return acc;
      const value = Number(match[1]);
      return Number.isFinite(value) ? Math.max(acc, value) : acc;
    }, 0);
    const nextNumber = String(maxNumber + 1).padStart(3, "0");
    const suggestion = `SKU-${nextNumber}`;
    setProductSkuSuggestion(suggestion);
    return suggestion;
  };

  const handleUpdateProduct = async () => {
    if (!productEditForm.id) return;
    setError(null);
    setProductEditMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/products/${productEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          sku: role === "ADMIN" ? productEditForm.sku || undefined : undefined,
          name: productEditForm.name || undefined,
          type: productEditForm.type || undefined,
          brand: productEditForm.brand || undefined,
          model: productEditForm.model || undefined,
        }),
      });
      setProductEditMessage("Produkt zaktualizowany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zapisac produktu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productEditForm.id) return;
    if (!confirm("Na pewno usunac produkt?")) return;
    setError(null);
    setProductEditMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/products/${productEditForm.id}`, { method: "DELETE" });
      setProductEditMessage("Produkt usuniety.");
      setProductEditForm({
        id: "",
        sku: "",
        name: "",
        type: "",
        brand: "",
        model: "",
      });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie usunac produktu");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeliveryItem = () => {
    setDeliveryForm((prev) => ({
      ...prev,
      items: [...prev.items, { sku: "", qty: "1", location_code: "" }],
    }));
  };

  const handleRemoveDeliveryItem = (index: number) => {
    setDeliveryForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleCreateDelivery = async () => {
    setError(null);
    setDeliveryMessage(null);
    setLoading(true);
    try {
      const payload = {
        supplier_id: Number(deliveryForm.supplier_id),
        document_no: deliveryForm.document_no,
        items: deliveryForm.items.map((item) => ({
          sku: item.sku,
          qty: Number(item.qty),
          location_code: item.location_code?.trim() || undefined,
        })),
      };
      await apiFetch("/deliveries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setDeliveryMessage("Dostawa dodana. Status: W TRAKCIE.");
      setDeliveryForm({
        supplier_id: "",
        document_no: "",
        items: [{ sku: "", qty: "1", location_code: "" }],
      });
      setDeliveryModalOpen(false);
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac dostawy");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPutawayItem = () => {
    setDeliveryPutawayForm((prev) => ({
      ...prev,
      items: [...prev.items, { sku: "", qty: "1", location_code: "" }],
    }));
  };

  const handleRemovePutawayItem = (index: number) => {
    setDeliveryPutawayForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handlePutawayDelivery = async () => {
    const hasMissingFields = deliveryPutawayForm.items.some(
      (item) => !item.sku || !item.qty || !item.location_code
    );
    if (!deliveryPutawayForm.delivery_id || hasMissingFields) {
      setError("Wypelnij ID dostawy oraz SKU/ilosc/lokacje dla kazdej pozycji.");
      return;
    }
    setError(null);
    setDeliveryMessage(null);
    setLoading(true);
    try {
      const payload = {
        items: deliveryPutawayForm.items.map((item) => ({
          sku: item.sku,
          qty: Number(item.qty),
          location_code: item.location_code,
        })),
      };
      await apiFetch(`/deliveries/${deliveryPutawayForm.delivery_id}/putaway`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setDeliveryMessage("Dostawa zmagazynowana.");
      setDeliveryPutawayForm({
        delivery_id: "",
        items: [{ sku: "", qty: "1", location_code: "" }],
      });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zmagazynowac dostawy");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrderItem = () => {
    setOrderForm((prev) => ({
      ...prev,
      items: [...prev.items, { sku: "", qty: "1" }],
    }));
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleCreateOrder = async () => {
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      const payload = {
        order_no: orderForm.order_no,
        customer_id: Number(orderForm.customer_id),
        priority: orderForm.priority,
        items: orderForm.items.map((item) => ({
          sku: item.sku,
          qty: Number(item.qty),
        })),
      };
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setOrderMessage("Zamowienie utworzone.");
      setOrderForm({
        order_no: "",
        customer_id: "",
        priority: false,
        items: [{ sku: "", qty: "1" }],
      });
      setOrderModalOpen(false);
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie utworzyc zamowienia");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueOrder = async () => {
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderAction.order_id}/issue`, { method: "POST" });
      setOrderMessage("Zamowienie wydane.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie wydac zamowienia");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderAction.order_id}/cancel`, { method: "POST" });
      setOrderMessage("Zamowienie anulowane.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie anulowac zamowienia");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePriority = async () => {
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderAction.order_id}/priority`, {
        method: "PATCH",
        body: JSON.stringify({ priority: orderAction.priority }),
      });
      setOrderMessage("Priorytet zaktualizowany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac priorytetu");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!orderSummary?.order_id) return;
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      const payload = { status: orderStatusUpdate || orderSummary.status };
      const updated = await apiFetch(`/orders/${orderSummary.order_id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setOrderSummary((prev: any) => ({ ...prev, status: updated.status }));
      setOrderMessage("Status zaktualizowany.");
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zmienic statusu");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchOrderSummary = async (orderId?: string) => {
    const targetId = orderId || orderDetailId;
    if (!targetId) return;
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      const summary = await apiFetch(`/orders/${targetId}/summary`);
      setOrderSummary(summary);
      setOrderStatusUpdate(summary.status);
      setOrderAction((prev) => ({ ...prev, order_id: String(summary.order_id) }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie pobrac podsumowania");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderMissingToDelivery = () => {
    if (!orderSummary) return;
    const missingItems = orderSummary.items
      .filter((item: any) => item.missing > 0)
      .map((item: any) => ({
        sku: item.sku,
        qty: String(item.missing),
        location_code: "",
      }));
    if (missingItems.length === 0) {
      setOrderMessage("Braki nie wystepuja.");
      return;
    }
    setDeliveryForm((prev) => ({
      ...prev,
      supplier_id: "",
      document_no: `AUTO-ORDER-${orderSummary.order_no}`,
      items: missingItems,
    }));
    setDeliveryWarehouseId("");
    setView("deliveries");
  };

  const handleSelectDelivery = (delivery: any) => {
    setDeliverySelected(delivery);
    setDeliveryPutawayForm((prev) => ({
      ...prev,
      delivery_id: String(delivery.id),
    }));
  };

  const handleSelectOrder = async (order: any) => {
    setOrderSelected(order);
    setOrderAction((prev) => ({ ...prev, order_id: String(order.id) }));
    setOrderDetailId(String(order.id));
    await handleFetchOrderSummary(String(order.id));
  };

  const handleQuickOrder = async () => {
    if (!orderQuickId) return;
    setError(null);
    setOrderQuickMessage(null);
    setLoading(true);
    try {
      const summary = await apiFetch(`/orders/${orderQuickId}/summary`);
      const missing = summary.items.filter((item: any) => item.missing > 0);
      if (missing.length > 0) {
        setOrderQuickSummary(summary);
        setOrderQuickMessage("Braki wykryte. Przejdz do dostaw, aby je uzupelnic.");
      } else {
        await apiFetch(`/orders/${summary.order_id}/issue`, { method: "POST" });
        setOrderQuickMessage("Zamowienie wydane.");
        await refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie wykonac akcji 1-klik");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickToDelivery = () => {
    if (!orderQuickSummary) return;
    const missingItems = orderQuickSummary.items
      .filter((item: any) => item.missing > 0)
      .map((item: any) => ({
        sku: item.sku,
        qty: String(item.missing),
        location_code: "",
      }));
    setDeliveryForm((prev) => ({
      ...prev,
      supplier_id: "",
      document_no: `AUTO-ORDER-${orderQuickSummary.order_no}`,
      items: missingItems,
    }));
    setDeliveryWarehouseId("");
    setView("deliveries");
  };

  const handleSearch = async () => {
    setError(null);
    setLoading(true);
    try {
      const results = await apiFetch(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(results);
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie wyszukac");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    setError(null);
    setCustomerMessage(null);
    setLoading(true);
    try {
      await apiFetch("/customers", {
        method: "POST",
        body: JSON.stringify(customerForm),
      });
      setCustomerMessage("Klient dodany.");
      setCustomerForm({ name: "", contact_data: "" });
      setCustomerModalOpen(false);
      await refresh();
      const customers = await apiFetch("/customers");
      setLookups((prev) => ({ ...prev, customers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac klienta");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setCustomerEditForm({
      id: String(customer.id),
      name: customer.name ?? "",
      contact_data: customer.contact_data ?? "",
    });
  };

  const handleUpdateCustomer = async () => {
    setError(null);
    setCustomerMessage(null);
    setLoading(true);
    try {
      const payload = {
        name: customerEditForm.name || undefined,
        contact_data: customerEditForm.contact_data || undefined,
      };
      await apiFetch(`/customers/${customerEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setCustomerMessage("Klient zaktualizowany.");
      setCustomerEditForm({ id: "", name: "", contact_data: "" });
      await refresh();
      const customers = await apiFetch("/customers");
      setLookups((prev) => ({ ...prev, customers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac klienta");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    setError(null);
    setCustomerMessage(null);
    setLoading(true);
    try {
      if (!window.confirm("Czy na pewno chcesz usunac klienta?")) {
        setLoading(false);
        return;
      }
      await apiFetch(`/customers/${customerEditForm.id}`, { method: "DELETE" });
      setCustomerMessage("Klient usuniety.");
      setCustomerEditForm({ id: "", name: "", contact_data: "" });
      await refresh();
      const customers = await apiFetch("/customers");
      setLookups((prev) => ({ ...prev, customers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie usunac klienta");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async () => {
    setError(null);
    setSupplierMessage(null);
    setLoading(true);
    try {
      await apiFetch("/suppliers", {
        method: "POST",
        body: JSON.stringify(supplierForm),
      });
      setSupplierMessage("Dostawca dodany.");
      setSupplierForm({ name: "", contact_data: "" });
      setSupplierModalOpen(false);
      await refresh();
      const suppliers = await apiFetch("/suppliers");
      setLookups((prev) => ({ ...prev, suppliers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac dostawcy");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSupplier = (supplier: any) => {
    setSupplierEditForm({
      id: String(supplier.id),
      name: supplier.name ?? "",
      contact_data: supplier.contact_data ?? "",
    });
  };

  const handleUpdateSupplier = async () => {
    setError(null);
    setSupplierMessage(null);
    setLoading(true);
    try {
      const payload = {
        name: supplierEditForm.name || undefined,
        contact_data: supplierEditForm.contact_data || undefined,
      };
      await apiFetch(`/suppliers/${supplierEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setSupplierMessage("Dostawca zaktualizowany.");
      setSupplierEditForm({ id: "", name: "", contact_data: "" });
      await refresh();
      const suppliers = await apiFetch("/suppliers");
      setLookups((prev) => ({ ...prev, suppliers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac dostawcy");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    setError(null);
    setSupplierMessage(null);
    setLoading(true);
    try {
      if (!window.confirm("Czy na pewno chcesz usunac dostawce?")) {
        setLoading(false);
        return;
      }
      await apiFetch(`/suppliers/${supplierEditForm.id}`, { method: "DELETE" });
      setSupplierMessage("Dostawca usuniety.");
      setSupplierEditForm({ id: "", name: "", contact_data: "" });
      await refresh();
      const suppliers = await apiFetch("/suppliers");
      setLookups((prev) => ({ ...prev, suppliers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie usunac dostawcy");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockLocation = async () => {
    setError(null);
    setWarehouseMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/locations/${warehouseView.location_id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ is_blocked: warehouseView.is_blocked }),
      });
      setWarehouseMessage("Lokacja zaktualizowana.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac lokacji");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBlockLocation = async (locationId: string) => {
    setWarehouseView((prev) => ({ ...prev, location_id: locationId }));
    if (!locationId) {
      setWarehouseView((prev) => ({ ...prev, is_blocked: false }));
      return;
    }
    try {
      const location = await apiFetch(`/locations/${locationId}`);
      setWarehouseView((prev) => ({
        ...prev,
        is_blocked: Boolean(location.is_blocked),
      }));
    } catch {
      // Ignore fetch errors; user can still set manually.
    }
  };

  const handleCreateLocation = async () => {
    setError(null);
    setLocationFormMessage(null);
    if (!locationForm.warehouse_id || !locationForm.code) {
      setError("Wybierz magazyn i wpisz kod lokacji.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/locations", {
        method: "POST",
        body: JSON.stringify({
          warehouse_id: Number(locationForm.warehouse_id),
          code: locationForm.code,
          description: locationForm.description || null,
          kind: locationForm.kind || "RACK_CELL",
          is_blocked: locationForm.is_blocked,
        }),
      });
      setLocationFormMessage("Lokacja dodana.");
      setLocationForm({
        warehouse_id: "",
        code: "",
        description: "",
        kind: "RACK_CELL",
        is_blocked: false,
      });
      await handleLoadWarehouses();
      if (warehouseSelected) {
        await handleLoadWarehouseDetails(String(warehouseSelected.id));
      }
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac lokacji");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadLocationForEdit = async (locationId: string) => {
    if (!locationId) {
      setLocationEditForm({
        id: "",
        warehouse_id: "",
        code: "",
        description: "",
        kind: "",
        is_blocked: false,
      });
      return;
    }
    setError(null);
    try {
      const location = await apiFetch(`/locations/${locationId}`);
      setLocationEditForm({
        id: String(location.id),
        warehouse_id: String(location.warehouse_id),
        code: location.code,
        description: location.description ?? "",
        kind: location.kind ?? "RACK_CELL",
        is_blocked: Boolean(location.is_blocked),
      });
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie pobrac lokacji");
    }
  };

  const handleUpdateLocation = async () => {
    if (!locationEditForm.id) return;
    setError(null);
    setLocationFormMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/locations/${locationEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          warehouse_id: locationEditForm.warehouse_id
            ? Number(locationEditForm.warehouse_id)
            : undefined,
          code: locationEditForm.code || undefined,
          description: locationEditForm.description || null,
          kind: locationEditForm.kind || undefined,
          is_blocked: locationEditForm.is_blocked,
        }),
      });
      setLocationFormMessage("Lokacja zaktualizowana.");
      await handleLoadWarehouses();
      if (warehouseSelected) {
        await handleLoadWarehouseDetails(String(warehouseSelected.id));
      }
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zapisac lokacji");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async () => {
    if (!locationEditForm.id) return;
    if (!confirm("Na pewno usunac lokacje?")) return;
    setError(null);
    setLocationFormMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/locations/${locationEditForm.id}`, { method: "DELETE" });
      setLocationFormMessage("Lokacja usunieta.");
      setLocationEditForm({
        id: "",
        warehouse_id: "",
        code: "",
        description: "",
        kind: "",
        is_blocked: false,
      });
      await handleLoadWarehouses();
      if (warehouseSelected) {
        await handleLoadWarehouseDetails(String(warehouseSelected.id));
      }
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie usunac lokacji");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWarehouses = async () => {
    const params = new URLSearchParams();
    if (warehouseQuery.q) params.set("q", warehouseQuery.q);
    if (warehouseQuery.sort) params.set("sort", warehouseQuery.sort);
    if (warehouseQuery.order) params.set("order", warehouseQuery.order);
    const list = await apiFetch(`/warehouses?${params.toString()}`);
    setWarehouseList(list);
    if (!warehouseSelected && list.length > 0) {
      setWarehouseSelected(list[0]);
      setWarehouseView((prev) => ({ ...prev, warehouse_id: String(list[0].id) }));
    }
  };

  const handleCreateWarehouse = async () => {
    setError(null);
    setWarehouseFormMessage(null);
    setLoading(true);
    try {
      await apiFetch("/warehouses", {
        method: "POST",
        body: JSON.stringify({
          name: warehouseForm.name,
          unit_scale: Number(warehouseForm.unit_scale),
        }),
      });
      setWarehouseForm({ name: "", unit_scale: "1.0" });
      setWarehouseFormMessage("Magazyn dodany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac magazynu");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWarehouse = async () => {
    setError(null);
    setWarehouseFormMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/warehouses/${warehouseEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: warehouseEditForm.name || undefined,
          unit_scale: warehouseEditForm.unit_scale
            ? Number(warehouseEditForm.unit_scale)
            : undefined,
        }),
      });
      setWarehouseEditForm({ id: "", name: "", unit_scale: "" });
      setWarehouseFormMessage("Magazyn zaktualizowany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac magazynu");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWarehouseDetails = async (warehouseId: string) => {
    const [dashboard, locations, stockResp] = await Promise.all([
      apiFetch(`/warehouses/${warehouseId}/dashboard`),
      apiFetch(`/warehouses/${warehouseId}/locations`),
      apiFetch(
        `/warehouses/${warehouseId}/stock/summary?q=${encodeURIComponent(
          warehouseStockQuery.q
        )}&page=${warehouseStockQuery.page}&page_size=${warehouseStockQuery.page_size}&sort=${warehouseStockQuery.sort}&order=${warehouseStockQuery.order}`
      ),
    ]);
    setWarehouseDashboard(dashboard);
    setWarehouseLocations(locations);
    setWarehouseStock(stockResp.items ?? []);
    setWarehouseStockTotal(stockResp.total ?? 0);
  };

  const handleSelectWarehouse = async (warehouse: any) => {
    setWarehouseSelected(warehouse);
    setWarehouseView((prev) => ({ ...prev, warehouse_id: String(warehouse.id) }));
    setWarehouseTab("summary");
    setWarehouseProductLocations([]);
    setLayoutLock(null);
    setWarehouseView((prev) => ({ ...prev, location_id: "" }));
    await handleLoadWarehouseDetails(String(warehouse.id));
  };

  const handleLoadProductLocations = async (productId: number) => {
    if (!warehouseSelected) return;
    const rows = await apiFetch(
      `/warehouses/${warehouseSelected.id}/stock/product/${productId}`
    );
    setWarehouseProductLocations(rows);
  };

  const lowStockThreshold = 5;

  const handleFetchLock = async () => {
    if (!warehouseView.warehouse_id) return;
    setError(null);
    setLayoutLockMessage(null);
    setLoading(true);
    try {
      const lock = await apiFetch(`/warehouses/${warehouseView.warehouse_id}/layout/lock`);
      setLayoutLock(lock);
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie pobrac locka");
    } finally {
      setLoading(false);
    }
  };

  const handleAcquireLock = async () => {
    if (!warehouseView.warehouse_id) return;
    setError(null);
    setLayoutLockMessage(null);
    setLoading(true);
    try {
      const lock = await apiFetch(`/warehouses/${warehouseView.warehouse_id}/layout/lock`, {
        method: "POST",
      });
      setLayoutLock(lock);
      setLayoutLockMessage("Lock zalozony.");
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zalozyc locka");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshLock = async () => {
    if (!warehouseView.warehouse_id || !layoutLock?.lock_id) return;
    setError(null);
    setLayoutLockMessage(null);
    setLoading(true);
    try {
      const lock = await apiFetch(
        `/warehouses/${warehouseView.warehouse_id}/layout/lock/refresh`,
        {
          method: "POST",
          body: JSON.stringify({ lock_id: layoutLock.lock_id }),
        }
      );
      setLayoutLock(lock);
      setLayoutLockMessage("Lock odswiezony.");
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie odswiezyc locka");
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseLock = async () => {
    if (!warehouseView.warehouse_id || !layoutLock?.lock_id) return;
    setError(null);
    setLayoutLockMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/warehouses/${warehouseView.warehouse_id}/layout/lock`, {
        method: "DELETE",
        body: JSON.stringify({ lock_id: layoutLock.lock_id }),
      });
      setLayoutLock(null);
      setLayoutLockMessage("Lock zwolniony.");
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zwolnic locka");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferStock = async () => {
    setError(null);
    setStockTransferMessage(null);
    setLoading(true);
    try {
      const payload = {
        product_id: Number(stockTransferForm.product_id),
        from_location_id: Number(stockTransferForm.from_location_id),
        to_location_id: Number(stockTransferForm.to_location_id),
        qty: Number(stockTransferForm.qty),
      };
      await apiFetch("/stock/transfer", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStockTransferMessage("Przeniesienie wykonane.");
      setStockTransferForm({
        product_id: "",
        from_location_id: "",
        to_location_id: "",
        qty: "1",
      });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie przeniesc stanu");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdminUser = async () => {
    setError(null);
    setAdminMessage(null);
    setLoading(true);
    try {
      await apiFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify(adminUserForm),
      });
      setAdminMessage("Uzytkownik dodany.");
      setAdminUserForm({ login: "", password: "", role: "MAGAZYNIER" });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac uzytkownika");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdminUser = async () => {
    setError(null);
    setAdminMessage(null);
    setLoading(true);
    try {
      const payload = {
        role: adminUpdateForm.role || undefined,
        is_active: adminUpdateForm.is_active,
        password: adminUpdateForm.password || undefined,
      };
      await apiFetch(`/admin/users/${adminUpdateForm.user_id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setAdminMessage("Uzytkownik zaktualizowany.");
      setAdminUpdateForm({
        user_id: "",
        role: "MAGAZYNIER",
        is_active: true,
        password: "",
      });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac uzytkownika");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setData([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("wms_token");
      window.localStorage.removeItem("wms_role");
    }
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (view === "dashboard") {
        const [products, stock, deliveries, orders] = await Promise.all([
          apiFetch(`/products?search=${encodeURIComponent(productSearch)}`),
          apiFetch(`/stock`),
          apiFetch(`/deliveries`),
          apiFetch(`/orders`),
        ]);
        setData([
          { label: "Produkty", value: products.length },
          { label: "Stany", value: stock.length },
          { label: "Dostawy", value: deliveries.length },
          { label: "Zamowienia", value: orders.length },
        ]);
      } else if (view === "products") {
        const query = productSearch ? `?search=${encodeURIComponent(productSearch)}` : "";
        const products = await apiFetch(`/products${query}`);
        setData(products);
      } else if (view === "stock") {
        const params = new URLSearchParams();
        if (stockFilters.warehouse_id) params.set("warehouse_id", stockFilters.warehouse_id);
        if (stockFilters.product_id) params.set("product_id", stockFilters.product_id);
        if (stockFilters.location_id) params.set("location_id", stockFilters.location_id);
        const stock = await apiFetch(`/stock?${params.toString()}`);
        setData(stock);
      } else if (view === "deliveries") {
        const params = new URLSearchParams();
        if (deliveryStatus) params.set("status", deliveryStatus);
        const [deliveries, inProgress] = await Promise.all([
          apiFetch(`/deliveries?${params.toString()}`),
          apiFetch(`/deliveries?status=W_TRAKCIE`),
        ]);
        setData(deliveries);
        setDeliveryInProgress(inProgress);
      } else if (view === "orders") {
        const params = new URLSearchParams();
        if (orderFilters.status) params.set("status", orderFilters.status);
        if (orderFilters.customer_id) params.set("customer_id", orderFilters.customer_id);
        if (orderFilters.priority) params.set("priority", orderFilters.priority);
        const orders = await apiFetch(`/orders?${params.toString()}`);
        setData(orders);
      } else if (view === "customers") {
        const query = customerSearch ? `?search=${encodeURIComponent(customerSearch)}` : "";
        const customers = await apiFetch(`/customers${query}`);
        setData(customers);
      } else if (view === "suppliers") {
        const query = supplierSearch ? `?search=${encodeURIComponent(supplierSearch)}` : "";
        const suppliers = await apiFetch(`/suppliers${query}`);
        setData(suppliers);
      } else if (view === "warehouses") {
        await handleLoadWarehouses();
        if (warehouseSelected) {
          await handleLoadWarehouseDetails(String(warehouseSelected.id));
        }
      } else if (view === "admin") {
        const users = await apiFetch(`/admin/users`);
        setData(users);
      } else if (view === "reports") {
        const params = new URLSearchParams();
        if (reportType === "audit") {
          if (reportFilters.action) params.set("action", reportFilters.action);
          if (reportFilters.user_id) params.set("user_id", reportFilters.user_id);
        } else if (reportType === "deliveries") {
          if (reportFilters.status) params.set("status", reportFilters.status);
          if (reportFilters.supplier_id) params.set("supplier_id", reportFilters.supplier_id);
        } else if (reportType === "orders") {
          if (reportFilters.status) params.set("status", reportFilters.status);
          if (reportFilters.customer_id) params.set("customer_id", reportFilters.customer_id);
          if (reportFilters.priority) params.set("priority", reportFilters.priority);
        }
        const query = params.toString();
        const report = await apiFetch(`/reports/${reportType}${query ? `?${query}` : ""}`);
        const rows = Array.isArray(report) ? report : [];
        setData(rows);
      }
    } catch (err: any) {
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const getColumns = () => {
    if (view === "products") {
      return [
        { key: "id", label: "ID" },
        { key: "sku", label: "SKU" },
        { key: "name", label: "Nazwa" },
        { key: "type", label: "Typ" },
        { key: "brand", label: "Marka" },
        { key: "model", label: "Model" },
      ];
    }
    if (view === "stock") {
      return [
        { key: "product", label: "Produkt (SKU / nazwa)" },
        { key: "warehouse", label: "Magazyn" },
        { key: "location", label: "Lokacja" },
        { key: "quantity", label: "Ilosc" },
      ];
    }
    if (view === "deliveries") {
      return [
        { key: "id", label: "ID" },
        { key: "document_no", label: "Dokument" },
        { key: "supplier_id", label: "Dostawca" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "Data" },
      ];
    }
    if (view === "orders") {
      return [
        { key: "id", label: "ID" },
        { key: "order_no", label: "Numer" },
        { key: "customer_id", label: "Klient" },
        { key: "status", label: "Status" },
        { key: "priority", label: "Priorytet" },
      ];
    }
    if (view === "customers") {
      return [
        { key: "id", label: "ID" },
        { key: "name", label: "Nazwa" },
        { key: "contact_data", label: "Kontakt" },
      ];
    }
    if (view === "suppliers") {
      return [
        { key: "id", label: "ID" },
        { key: "name", label: "Nazwa" },
        { key: "contact_data", label: "Kontakt" },
      ];
    }
    if (view === "warehouses") {
      return [
        { key: "id", label: "ID" },
        { key: "code", label: "Kod" },
        { key: "description", label: "Opis" },
        { key: "kind", label: "Typ" },
        { key: "is_blocked", label: "Zablokowana" },
      ];
    }
    if (view === "admin") {
      return [
        { key: "id", label: "ID" },
        { key: "login", label: "Login" },
        { key: "role", label: "Rola" },
        { key: "is_active", label: "Aktywny" },
      ];
    }
    if (view === "reports") {
      if (reportType === "stock") {
        return [
          { key: "product_id", label: "Produkt" },
          { key: "location_id", label: "Lokacja" },
          { key: "quantity", label: "Ilosc" },
        ];
      }
      if (reportType === "deliveries") {
        return [
          { key: "document_no", label: "Dokument" },
          { key: "supplier_id", label: "Dostawca" },
          { key: "status", label: "Status" },
          { key: "created_at", label: "Data" },
        ];
      }
      if (reportType === "orders") {
        return [
          { key: "order_no", label: "Numer" },
          { key: "customer_id", label: "Klient" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priorytet" },
        ];
      }
      if (reportType === "audit") {
        return [
          { key: "created_at", label: "Data" },
          { key: "action", label: "Akcja" },
          { key: "user_id", label: "Uzytkownik" },
          { key: "entity", label: "Encja" },
          { key: "entity_id", label: "ID encji" },
        ];
      }
    }
    return [];
  };

  const renderCell = (row: any, key: string) => {
    if (view === "stock") {
      if (key === "product") {
        const product = lookups.products.find(
          (item) => String(item.id) === String(row?.product_id)
        );
        if (!product) return `ID ${row?.product_id ?? "-"}`;
        return `${product.sku} - ${product.name}`;
      }
      if (key === "location") {
        const location = lookups.locations.find(
          (item) => String(item.id) === String(row?.location_id)
        );
        if (!location) return `ID ${row?.location_id ?? "-"}`;
        return `${location.code} (ID ${location.id})`;
      }
      if (key === "warehouse") {
        const location = lookups.locations.find(
          (item) => String(item.id) === String(row?.location_id)
        );
        const warehouse = lookups.warehouses.find(
          (item) => String(item.id) === String(location?.warehouse_id)
        );
        if (!warehouse) return location?.warehouse_id ? `ID ${location.warehouse_id}` : "-";
        return `${warehouse.name} (ID ${warehouse.id})`;
      }
    }
    const value = row?.[key];
    if (value === null || value === undefined) return "-";
    if (
      key === "status" &&
      (view === "deliveries" || (view === "reports" && reportType === "deliveries"))
    ) {
      if (value === "W_TRAKCIE") return "W trakcie (oczekuje)";
      if (value === "ZATWIERDZONA") return "Zmagazynowana";
    }
    if (typeof value === "boolean") return value ? "Tak" : "Nie";
    return String(value);
  };

  const getDisplayRows = () => {
    if (!Array.isArray(data)) return [];
    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
    const currentPage = Math.min(pagination.page, totalPages);
    const start = (currentPage - 1) * pagination.limit;
    return data.slice(start, start + pagination.limit);
  };

  const getVirtualRows = (rows: any[]) => {
    const rowHeight = 48;
    const buffer = 6;
    if (!viewportHeight) {
      return { rows, top: 0, bottom: 0 };
    }
    const totalRows = rows.length;
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + buffer * 2;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const endIndex = Math.min(totalRows, startIndex + visibleCount);
    return {
      rows: rows.slice(startIndex, endIndex),
      top: startIndex * rowHeight,
      bottom: (totalRows - endIndex) * rowHeight,
    };
  };

  const getPaginationInfo = () => {
    const total = Array.isArray(data) ? data.length : 0;
    const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
    const currentPage = Math.min(pagination.page, totalPages);
    return { total, totalPages, currentPage };
  };

  const getRowKey = (row: any, index: number) =>
    row?.id ??
    row?.order_no ??
    row?.document_no ??
    row?.sku ??
    row?.action ??
    `row-${index}`;

  const renderDataTable = () => (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <div
        ref={tableContainerRef}
        className="max-h-[420px] overflow-auto"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-white">
            {getColumns().length > 0 ? (
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                {getColumns().map((col) => (
                  <th key={col.key} className="px-4 py-3">
                    {col.label}
                  </th>
                ))}
              </tr>
            ) : (
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Podglad</th>
              </tr>
            )}
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground">
                  Brak danych. Uzyj filtrow lub odswiez.
                </td>
              </tr>
            )}
            {(() => {
              const pagedRows = getDisplayRows();
              const virtual = getVirtualRows(pagedRows);
              const colSpan = Math.max(1, getColumns().length);
              return (
                <>
                  {virtual.top > 0 && (
                    <tr>
                      <td style={{ height: virtual.top }} colSpan={colSpan} />
                    </tr>
                  )}
                  {virtual.rows.map((row, index) => (
                    <tr key={getRowKey(row, index)} className="border-b">
                      {getColumns().length > 0 ? (
                        getColumns().map((col) => (
                          <td key={col.key} className="px-4 py-3">
                            {renderCell(row, col.key)}
                          </td>
                        ))
                      ) : (
                        <td className="px-4 py-3">
                          <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                            {JSON.stringify(row, null, 2)}
                          </pre>
                        </td>
                      )}
                    </tr>
                  ))}
                  {virtual.bottom > 0 && (
                    <tr>
                      <td style={{ height: virtual.bottom }} colSpan={colSpan} />
                    </tr>
                  )}
                </>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );

  const canPutawayDelivery = React.useMemo(() => {
    if (!deliveryPutawayForm.delivery_id) return false;
    return deliveryPutawayForm.items.every(
      (item) => item.sku && Number(item.qty) > 0 && item.location_code
    );
  }, [deliveryPutawayForm]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_oklch(0.97_0.03_240),_transparent_55%),linear-gradient(135deg,_oklch(0.99_0.01_200),_oklch(0.94_0.02_40))] px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3 rounded-3xl border bg-white/80 px-6 py-6 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Warehouse Management System
              </p>
              <h1 className="text-2xl font-semibold">WMS Console</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>API: {API_URL}</span>
              <span className="rounded-full border px-3 py-1">
                Status: {health}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Role: {role ?? "brak"}</span>
            {token && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Wyloguj
              </Button>
            )}
          </div>
        </header>

        {!token ? (
          <Card className="max-w-xl border-0 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle>Zaloguj sie</CardTitle>
              <CardDescription>Uzyj konta ADMIN/KIEROWNIK/MAGAZYNIER.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  placeholder="admin"
                  value={loginForm.username}
                  onChange={(event) =>
                    setLoginForm((prev) => ({ ...prev, username: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Haslo</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleLogin} disabled={loading}>
                {loading ? "Logowanie..." : "Zaloguj"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="flex flex-col gap-3 rounded-2xl border bg-white/90 p-4 shadow-sm">
              {(
                [
                  ["dashboard", "Dashboard"],
                  ["products", "Produkty"],
                  ["stock", "Stany"],
                  ["deliveries", "Dostawy"],
                  ["orders", "Zamowienia"],
                  ["customers", "Klienci"],
                  ["suppliers", "Dostawcy"],
                  ["warehouses", "Magazyny"],
                  ["search", "Szukaj"],
                  ["admin", "Admin"],
                  ["reports", "Raporty"],
                ] as [ViewKey, string][]
              )
                .filter(([key]) => allowedViews.has(key))
                .map(([key, label]) => (
                <Button
                  key={key}
                  variant={view === key ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setView(key)}
                >
                  {label}
                </Button>
              ))}
              <Button variant="ghost" onClick={refresh} disabled={loading}>
                {loading ? "Ladowanie..." : "Odswiez"}
              </Button>
            </aside>

            <section className="flex flex-col gap-4 rounded-2xl border bg-white/95 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    {view === "dashboard" && "Przeglad"}
                    {view === "products" && "Produkty"}
                    {view === "stock" && "Stany magazynowe"}
                    {view === "deliveries" && "Dostawy"}
                    {view === "orders" && "Zamowienia"}
                    {view === "customers" && "Klienci"}
                    {view === "suppliers" && "Dostawcy"}
                    {view === "warehouses" && "Magazyny i lokacje"}
                    {view === "search" && "Wyszukiwarka"}
                    {view === "admin" && "Administracja"}
                    {view === "reports" && "Raporty"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Dane pobierane na zadanie, zeby nie obciazac przegladarki.
                  </p>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              {!allowedViews.has(view) && (
                <Card className="border-0 bg-secondary/60">
                  <CardHeader>
                    <CardTitle className="text-base">Brak dostepu</CardTitle>
                    <CardDescription>
                      Twoja rola nie ma uprawnien do tej sekcji.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {view === "products" && (
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="grid gap-2">
                      <Label>Szukaj (sku / nazwa)</Label>
                      <Input
                        value={productSearch}
                        onChange={(event) => setProductSearch(event.target.value)}
                        placeholder="np. SKU-001"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                      <Button onClick={() => setProductModalOpen(true)} disabled={!canManageProducts}>
                        Dodaj nowy produkt
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border bg-white">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3">Nazwa</th>
                            <th className="px-4 py-3">Typ</th>
                            <th className="px-4 py-3">Marka</th>
                            <th className="px-4 py-3">Model</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length === 0 && (
                            <tr>
                              <td className="px-4 py-6 text-muted-foreground">
                                Brak produktow. Dodaj pierwszy produkt.
                              </td>
                            </tr>
                          )}
                          {data.map((product: any) => (
                            <tr
                              key={product.id}
                              className="cursor-pointer border-b hover:bg-secondary/40"
                              onClick={() => handleSelectProduct(product)}
                            >
                              <td className="px-4 py-3">{product.sku}</td>
                              <td className="px-4 py-3">{product.name}</td>
                              <td className="px-4 py-3">{product.type ?? "-"}</td>
                              <td className="px-4 py-3">{product.brand ?? "-"}</td>
                              <td className="px-4 py-3">{product.model ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {productEditForm.id && (
                    <Card className="border-0 bg-secondary/60">
                      <CardHeader>
                        <CardTitle className="text-base">Edytuj produkt</CardTitle>
                        <CardDescription>Kliknij produkt w tabeli, aby go edytowac.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>SKU</Label>
                          <Input
                            value={productEditForm.sku}
                            onChange={(event) =>
                              setProductEditForm((prev) => ({
                                ...prev,
                                sku: event.target.value,
                              }))
                            }
                            disabled={role !== "ADMIN"}
                          />
                          {role !== "ADMIN" && (
                            <p className="text-xs text-muted-foreground">
                              Zmiana SKU jest dostepna tylko dla ADMINA.
                            </p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label>Nazwa</Label>
                          <Input
                            value={productEditForm.name}
                            onChange={(event) =>
                              setProductEditForm((prev) => ({
                                ...prev,
                                name: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Typ</Label>
                          <Input
                            value={productEditForm.type}
                            onChange={(event) =>
                              setProductEditForm((prev) => ({
                                ...prev,
                                type: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Marka</Label>
                          <Input
                            value={productEditForm.brand}
                            onChange={(event) =>
                              setProductEditForm((prev) => ({
                                ...prev,
                                brand: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label>Model</Label>
                          <Input
                            value={productEditForm.model}
                            onChange={(event) =>
                              setProductEditForm((prev) => ({
                                ...prev,
                                model: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                          <Button onClick={handleUpdateProduct} disabled={!canManageProducts || loading}>
                            Zapisz zmiany
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteProduct}
                            disabled={!canManageProducts || loading}
                          >
                            Usun produkt
                          </Button>
                          {productEditMessage && (
                            <p className="text-sm text-emerald-600">{productEditMessage}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {productModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-xl rounded-2xl border bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <div>
                        <h3 className="text-lg font-semibold">Dodaj produkt</h3>
                        <p className="text-sm text-muted-foreground">
                          Uzupelnij dane nowego produktu.
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => setProductModalOpen(false)}>
                        Zamknij
                      </Button>
                    </div>
                    <div className="grid gap-4 p-6 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>SKU</Label>
                        <Input
                          value={productForm.sku}
                          onChange={(event) =>
                            setProductForm((prev) => ({ ...prev, sku: event.target.value }))
                          }
                          disabled={!canManageProducts}
                        />
                        {productSkuSuggestion && !productForm.sku && (
                          <p className="text-xs text-muted-foreground">
                            Podpowiedź: {productSkuSuggestion}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label>Nazwa</Label>
                        <Input
                          value={productForm.name}
                          onChange={(event) =>
                            setProductForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          disabled={!canManageProducts}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Typ</Label>
                        <Input
                          value={productForm.type}
                          onChange={(event) =>
                            setProductForm((prev) => ({ ...prev, type: event.target.value }))
                          }
                          disabled={!canManageProducts}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Marka</Label>
                        <Input
                          value={productForm.brand}
                          onChange={(event) =>
                            setProductForm((prev) => ({ ...prev, brand: event.target.value }))
                          }
                          disabled={!canManageProducts}
                        />
                      </div>
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Model</Label>
                        <Input
                          value={productForm.model}
                          onChange={(event) =>
                            setProductForm((prev) => ({ ...prev, model: event.target.value }))
                          }
                          disabled={!canManageProducts}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button onClick={handleCreateProduct} disabled={!canManageProducts || loading}>
                          Dodaj produkt
                        </Button>
                        {productMessage && (
                          <p className="text-sm text-emerald-600">{productMessage}</p>
                        )}
                        {!canManageProducts && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do dodawania produktow.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {deliveryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-2xl rounded-2xl border bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <div>
                        <h3 className="text-lg font-semibold">Przyjecie dostawy</h3>
                        <p className="text-sm text-muted-foreground">
                          Dostawa startuje jako W TRAKCIE. Lokacje uzupelnisz przy
                          zmagazynowaniu.
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => setDeliveryModalOpen(false)}>
                        Zamknij
                      </Button>
                    </div>
                    <div className="grid gap-4 p-6">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>ID dostawcy</Label>
                          <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={deliveryForm.supplier_id}
                            onChange={(event) =>
                              setDeliveryForm((prev) => ({
                                ...prev,
                                supplier_id: event.target.value,
                              }))
                            }
                            disabled={!canManageDeliveries}
                          >
                            <option value="">Wybierz dostawce...</option>
                            {lookups.suppliers.map((supplier) => (
                              <option key={supplier.id} value={supplier.id}>
                                {supplier.name} (ID {supplier.id})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Numer dokumentu</Label>
                          <Input
                            value={deliveryForm.document_no}
                            onChange={(event) =>
                              setDeliveryForm((prev) => ({
                                ...prev,
                                document_no: event.target.value,
                              }))
                            }
                            disabled={!canManageDeliveries}
                          />
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <Label>Pozycje dostawy</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddDeliveryItem}
                            disabled={!canManageDeliveries}
                          >
                            Dodaj pozycje
                          </Button>
                        </div>
                        <div className="grid gap-3">
                          {deliveryForm.items.map((item, index) => (
                            <div
                              key={`delivery-item-${index}`}
                              className="grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-3"
                            >
                              <div className="grid gap-2">
                                <Label>Kod produktu (SKU)</Label>
                                <Input
                                  value={item.sku}
                                  onChange={(event) =>
                                    setDeliveryForm((prev) => ({
                                      ...prev,
                                      items: prev.items.map((row, idx) =>
                                        idx === index ? { ...row, sku: event.target.value } : row
                                      ),
                                    }))
                                  }
                                  list="product-skus"
                                  disabled={!canManageDeliveries}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Ilosc sztuk</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.qty}
                                  onChange={(event) =>
                                    setDeliveryForm((prev) => ({
                                      ...prev,
                                      items: prev.items.map((row, idx) =>
                                        idx === index ? { ...row, qty: event.target.value } : row
                                      ),
                                    }))
                                  }
                                  disabled={!canManageDeliveries}
                                />
                              </div>
                              <div className="flex items-end justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveDeliveryItem(index)}
                                  disabled={!canManageDeliveries || deliveryForm.items.length === 1}
                                >
                                  Usun
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          onClick={handleCreateDelivery}
                          disabled={!canManageDeliveries || loading}
                        >
                          Zapisz dostawe
                        </Button>
                        {deliveryMessage && (
                          <p className="text-sm text-emerald-600">{deliveryMessage}</p>
                        )}
                        {!canManageDeliveries && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do przyjmowania dostaw.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {orderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-2xl rounded-2xl border bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <div>
                        <h3 className="text-lg font-semibold">Nowe zamowienie</h3>
                        <p className="text-sm text-muted-foreground">
                          Podaj klienta i pozycje.
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => setOrderModalOpen(false)}>
                        Zamknij
                      </Button>
                    </div>
                    <div className="grid gap-4 p-6">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Numer zamowienia</Label>
                          <Input
                            value={orderForm.order_no}
                            onChange={(event) =>
                              setOrderForm((prev) => ({
                                ...prev,
                                order_no: event.target.value,
                              }))
                            }
                            disabled={!canCreateOrders}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>ID klienta</Label>
                          <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={orderForm.customer_id}
                            onChange={(event) =>
                              setOrderForm((prev) => ({
                                ...prev,
                                customer_id: event.target.value,
                              }))
                            }
                            disabled={!canCreateOrders}
                          >
                            <option value="">Wybierz klienta...</option>
                            {lookups.customers.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name} (ID {customer.id})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                          <input
                            id="priority"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={orderForm.priority}
                            onChange={(event) =>
                              setOrderForm((prev) => ({
                                ...prev,
                                priority: event.target.checked,
                              }))
                            }
                            disabled={!canCreateOrders}
                          />
                          <Label htmlFor="priority">Priorytetowe</Label>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <Label>Pozycje zamowienia</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddOrderItem}
                            disabled={!canCreateOrders}
                          >
                            Dodaj pozycje
                          </Button>
                        </div>
                        {orderForm.items.map((item, index) => (
                          <div
                            key={`order-item-${index}`}
                            className="grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-3"
                          >
                            <div className="grid gap-2">
                              <Label>Kod produktu (SKU)</Label>
                              <Input
                                value={item.sku}
                                onChange={(event) =>
                                  setOrderForm((prev) => ({
                                    ...prev,
                                    items: prev.items.map((row, idx) =>
                                      idx === index ? { ...row, sku: event.target.value } : row
                                    ),
                                  }))
                                }
                                list="product-skus"
                                disabled={!canCreateOrders}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Ilosc sztuk</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(event) =>
                                  setOrderForm((prev) => ({
                                    ...prev,
                                    items: prev.items.map((row, idx) =>
                                      idx === index ? { ...row, qty: event.target.value } : row
                                    ),
                                  }))
                                }
                                disabled={!canCreateOrders}
                              />
                            </div>
                            <div className="flex items-end justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveOrderItem(index)}
                                disabled={!canCreateOrders || orderForm.items.length === 1}
                              >
                                Usun
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button onClick={handleCreateOrder} disabled={!canCreateOrders || loading}>
                          Utworz zamowienie
                        </Button>
                        {orderMessage && (
                          <p className="text-sm text-emerald-600">{orderMessage}</p>
                        )}
                        {!canCreateOrders && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do tworzenia zamowien.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {view === "deliveries" && (
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Input
                        value={deliveryStatus}
                        onChange={(event) => setDeliveryStatus(event.target.value)}
                        placeholder="W_TRAKCIE"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                      <Button onClick={() => setDeliveryModalOpen(true)} disabled={!canManageDeliveries}>
                        Dodaj dostawe
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border bg-white">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="px-4 py-3">Dokument</th>
                            <th className="px-4 py-3">Dostawca</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length === 0 && (
                            <tr>
                              <td className="px-4 py-6 text-muted-foreground">
                                Brak dostaw. Dodaj pierwsza dostawe.
                              </td>
                            </tr>
                          )}
                          {data.map((delivery: any) => (
                            <tr
                              key={delivery.id}
                              className={`cursor-pointer border-b hover:bg-secondary/40 ${
                                deliverySelected?.id === delivery.id ? "bg-secondary/40" : ""
                              }`}
                              onClick={() => handleSelectDelivery(delivery)}
                            >
                              <td className="px-4 py-3">{delivery.document_no}</td>
                              <td className="px-4 py-3">ID {delivery.supplier_id}</td>
                              <td className="px-4 py-3">
                                {renderCell(delivery, "status")}
                              </td>
                              <td className="px-4 py-3">{delivery.created_at ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {deliverySelected && (
                    <Card className="border-0 bg-secondary/60">
                      <CardHeader>
                        <CardTitle className="text-base">Wybrana dostawa</CardTitle>
                        <CardDescription>
                          ID {deliverySelected.id} · dokument {deliverySelected.document_no}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Status: {renderCell(deliverySelected, "status")}
                      </CardContent>
                    </Card>
                  )}
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Zmagazynuj dostawe</CardTitle>
                      <CardDescription>
                        Dla dostaw w trakcie. Tu wybierasz magazyn i lokacje, a system
                        podniesie stany i ustawi status ZMAGAZYNOWANA.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Dostawy w trakcie</Label>
                          <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={deliveryPutawayForm.delivery_id}
                            onChange={(event) =>
                              setDeliveryPutawayForm((prev) => ({
                                ...prev,
                                delivery_id: event.target.value,
                              }))
                            }
                            disabled={!canManageDeliveries}
                          >
                            <option value="">Wybierz dostawe...</option>
                            {deliveryInProgress.map((delivery) => (
                              <option key={delivery.id} value={delivery.id}>
                                {delivery.document_no} (ID {delivery.id})
                              </option>
                            ))}
                          </select>
                          <Input
                            value={deliveryPutawayForm.delivery_id}
                            onChange={(event) =>
                              setDeliveryPutawayForm((prev) => ({
                                ...prev,
                                delivery_id: event.target.value,
                              }))
                            }
                            placeholder="lub wpisz ID dostawy"
                            disabled={!canManageDeliveries}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Magazyn (filtr lokacji)</Label>
                          <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={deliveryWarehouseId}
                            onChange={(event) => setDeliveryWarehouseId(event.target.value)}
                          >
                            <option value="">Wszystkie magazyny...</option>
                            {lookups.warehouses.map((warehouse) => (
                              <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name} (ID {warehouse.id})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Pozycje do zmagazynowania</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddPutawayItem}
                          disabled={!canManageDeliveries}
                        >
                          Dodaj pozycje
                        </Button>
                      </div>
                      {deliveryItemsSummary.length > 0 && (
                        <div className="rounded-xl border bg-white">
                          <div className="border-b px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground">
                            Zawartosc dostawy
                          </div>
                          <table className="min-w-full text-left text-sm">
                            <thead className="sticky top-0 bg-white">
                              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <th className="px-4 py-2">SKU</th>
                                <th className="px-4 py-2">Produkt</th>
                                <th className="px-4 py-2">Ilosc</th>
                              </tr>
                            </thead>
                            <tbody>
                              {deliveryItemsSummary.map((item: any) => {
                                const product = lookups.products.find(
                                  (row) => String(row.id) === String(item.product_id)
                                );
                                return (
                                  <tr key={item.id} className="border-b">
                                    <td className="px-4 py-2">{product?.sku ?? "-"}</td>
                                    <td className="px-4 py-2">{product?.name ?? "-"}</td>
                                    <td className="px-4 py-2">{item.qty}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div className="grid gap-3">
                        {deliveryPutawayForm.items.map((item, index) => (
                          <div
                            key={`putaway-item-${index}`}
                            className="grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-4"
                          >
                            <div className="grid gap-2">
                              <Label>Kod produktu (SKU)</Label>
                              <Input
                                value={item.sku}
                                onChange={(event) =>
                                  setDeliveryPutawayForm((prev) => ({
                                    ...prev,
                                    items: prev.items.map((row, idx) =>
                                      idx === index ? { ...row, sku: event.target.value } : row
                                    ),
                                  }))
                                }
                                list="product-skus"
                                disabled={!canManageDeliveries}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Ilosc</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(event) =>
                                  setDeliveryPutawayForm((prev) => ({
                                    ...prev,
                                    items: prev.items.map((row, idx) =>
                                      idx === index ? { ...row, qty: event.target.value } : row
                                    ),
                                  }))
                                }
                                disabled={!canManageDeliveries}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Kod lokacji</Label>
                              <Input
                                value={item.location_code}
                                onChange={(event) =>
                                  setDeliveryPutawayForm((prev) => ({
                                    ...prev,
                                    items: prev.items.map((row, idx) =>
                                      idx === index
                                        ? { ...row, location_code: event.target.value }
                                        : row
                                    ),
                                  }))
                                }
                                list="location-codes"
                                disabled={!canManageDeliveries}
                              />
                            </div>
                            <div className="flex items-end justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePutawayItem(index)}
                                disabled={!canManageDeliveries || deliveryPutawayForm.items.length === 1}
                              >
                                Usun
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          onClick={handlePutawayDelivery}
                          disabled={!canManageDeliveries || loading || !canPutawayDelivery}
                        >
                          Zmagazynuj dostawe
                        </Button>
                        {!canPutawayDelivery && (
                          <p className="text-sm text-muted-foreground">
                            Wypelnij SKU, ilosc i lokacje dla kazdej pozycji.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {customerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-xl rounded-2xl border bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <div>
                        <h3 className="text-lg font-semibold">Dodaj klienta</h3>
                        <p className="text-sm text-muted-foreground">
                          Klienci sa wymagani przy tworzeniu zamowien.
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => setCustomerModalOpen(false)}>
                        Zamknij
                      </Button>
                    </div>
                    <div className="grid gap-4 p-6 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Nazwa klienta</Label>
                        <Input
                          value={customerForm.name}
                          onChange={(event) =>
                            setCustomerForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          disabled={!canManageCustomers}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Dane kontaktowe</Label>
                        <Input
                          value={customerForm.contact_data}
                          onChange={(event) =>
                            setCustomerForm((prev) => ({
                              ...prev,
                              contact_data: event.target.value,
                            }))
                          }
                          disabled={!canManageCustomers}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button
                          onClick={handleCreateCustomer}
                          disabled={!canManageCustomers || loading}
                        >
                          Dodaj klienta
                        </Button>
                        {customerMessage && (
                          <p className="text-sm text-emerald-600">{customerMessage}</p>
                        )}
                        {!canManageCustomers && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do dodawania klientow.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {supplierModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-xl rounded-2xl border bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <div>
                        <h3 className="text-lg font-semibold">Dodaj dostawce</h3>
                        <p className="text-sm text-muted-foreground">
                          Dostawcy sa wymagani przy przyjeciu dostaw.
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => setSupplierModalOpen(false)}>
                        Zamknij
                      </Button>
                    </div>
                    <div className="grid gap-4 p-6 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Nazwa dostawcy</Label>
                        <Input
                          value={supplierForm.name}
                          onChange={(event) =>
                            setSupplierForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          disabled={!canManageSuppliers}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Dane kontaktowe</Label>
                        <Input
                          value={supplierForm.contact_data}
                          onChange={(event) =>
                            setSupplierForm((prev) => ({
                              ...prev,
                              contact_data: event.target.value,
                            }))
                          }
                          disabled={!canManageSuppliers}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button
                          onClick={handleCreateSupplier}
                          disabled={!canManageSuppliers || loading}
                        >
                          Dodaj dostawce
                        </Button>
                        {supplierMessage && (
                          <p className="text-sm text-emerald-600">{supplierMessage}</p>
                        )}
                        {!canManageSuppliers && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do dodawania dostawcow.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {view === "stock" && (
                <div className="grid gap-3">
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Podglad stanow</CardTitle>
                      <CardDescription>
                        Tabela ponizej pokazuje produkt, magazyn, lokacje i ilosc.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Magazyn</Label>
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={stockFilters.warehouse_id}
                        onChange={(event) =>
                          setStockFilters((prev) => ({
                            ...prev,
                            warehouse_id: event.target.value,
                          }))
                        }
                      >
                        <option value="">Wszystkie magazyny...</option>
                        {lookups.warehouses.map((warehouse) => (
                          <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name} (ID {warehouse.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Produkt (SKU / nazwa)</Label>
                      <Input
                        value={stockFilterLookup.product}
                        onChange={(event) =>
                          setStockFilterLookup((prev) => ({
                            ...prev,
                            product: event.target.value,
                          }))
                        }
                        placeholder="np. SKU-001"
                      />
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={stockFilters.product_id}
                        onChange={(event) =>
                          setStockFilters((prev) => ({
                            ...prev,
                            product_id: event.target.value,
                          }))
                        }
                      >
                        <option value="">Wszystkie produkty...</option>
                        {lookups.products
                          .filter((product) =>
                            stockFilterLookup.product
                              ? `${product.sku} ${product.name}`
                                  .toLowerCase()
                                  .includes(stockFilterLookup.product.toLowerCase())
                              : true
                          )
                          .slice(0, 120)
                          .map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.sku} - {product.name} (ID {product.id})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Lokacja</Label>
                      <Input
                        value={stockFilterLookup.location}
                        onChange={(event) =>
                          setStockFilterLookup((prev) => ({
                            ...prev,
                            location: event.target.value,
                          }))
                        }
                        placeholder="np. A1"
                      />
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={stockFilters.location_id}
                        onChange={(event) =>
                          setStockFilters((prev) => ({
                            ...prev,
                            location_id: event.target.value,
                          }))
                        }
                      >
                        <option value="">Wszystkie lokacje...</option>
                        {lookups.locations
                          .filter((location) =>
                            stockFilterLookup.location
                              ? location.code
                                  .toLowerCase()
                                  .startsWith(stockFilterLookup.location.toLowerCase())
                              : true
                          )
                          .slice(0, 120)
                          .map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.code} (ID {location.id})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                    </div>
                  </div>
                  {renderDataTable()}
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Szybkie przeniesienie stanu</CardTitle>
                      <CardDescription>
                        Przenies produkt miedzy lokacjami (MAGAZYNIER/KIEROWNIK).
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Filtr SKU / nazwa</Label>
                        <Input
                          value={stockTransferFilter.product}
                          onChange={(event) =>
                            setStockTransferFilter((prev) => ({
                              ...prev,
                              product: event.target.value,
                            }))
                          }
                          placeholder="np. SKU"
                        />
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={stockTransferForm.product_id}
                          onChange={(event) =>
                            setStockTransferForm((prev) => ({
                              ...prev,
                              product_id: event.target.value,
                            }))
                          }
                        >
                          <option value="">Wybierz produkt...</option>
                          {lookups.products
                            .filter((product) =>
                              stockTransferFilter.product
                                ? `${product.sku} ${product.name}`
                                    .toLowerCase()
                                    .includes(stockTransferFilter.product.toLowerCase())
                                : true
                            )
                            .slice(0, 80)
                            .map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.sku} - {product.name} (ID {product.id})
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Ilosc do przeniesienia</Label>
                        <Input
                          type="number"
                          min="1"
                          value={stockTransferForm.qty}
                          onChange={(event) =>
                            setStockTransferForm((prev) => ({
                              ...prev,
                              qty: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Filtr kodu lokacji</Label>
                        <Input
                          value={stockTransferFilter.location}
                          onChange={(event) =>
                            setStockTransferFilter((prev) => ({
                              ...prev,
                              location: event.target.value,
                            }))
                          }
                          placeholder="np. A1"
                        />
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={stockTransferForm.from_location_id}
                          onChange={(event) =>
                            setStockTransferForm((prev) => ({
                              ...prev,
                              from_location_id: event.target.value,
                            }))
                          }
                        >
                          <option value="">Z lokacji...</option>
                          {lookups.locations
                            .filter((location) =>
                              stockTransferFilter.location
                                ? location.code
                                    .toLowerCase()
                                    .startsWith(stockTransferFilter.location.toLowerCase())
                                : true
                            )
                            .slice(0, 80)
                            .map((location) => (
                              <option key={location.id} value={location.id}>
                                {location.code} (ID {location.id})
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Na lokacje</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={stockTransferForm.to_location_id}
                          onChange={(event) =>
                            setStockTransferForm((prev) => ({
                              ...prev,
                              to_location_id: event.target.value,
                            }))
                          }
                        >
                          <option value="">Do lokacji...</option>
                          {lookups.locations
                            .filter((location) =>
                              stockTransferFilter.location
                                ? location.code
                                    .toLowerCase()
                                    .startsWith(stockTransferFilter.location.toLowerCase())
                                : true
                            )
                            .slice(0, 80)
                            .map((location) => (
                              <option key={location.id} value={location.id}>
                                {location.code} (ID {location.id})
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button
                          onClick={handleTransferStock}
                          disabled={
                            !canTransferStock ||
                            loading ||
                            !stockTransferForm.product_id ||
                            !stockTransferForm.from_location_id ||
                            !stockTransferForm.to_location_id
                          }
                        >
                          Przenies
                        </Button>
                        {!canTransferStock && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do przenoszenia stanu.
                          </p>
                        )}
                        {stockTransferMessage && (
                          <p className="text-sm text-emerald-600">{stockTransferMessage}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {view === "orders" && (
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Input
                        value={orderFilters.status}
                        onChange={(event) =>
                          setOrderFilters((prev) => ({
                            ...prev,
                            status: event.target.value,
                          }))
                        }
                        placeholder="NOWE"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>ID klienta</Label>
                      <Input
                        value={orderFilters.customer_id}
                        onChange={(event) =>
                          setOrderFilters((prev) => ({
                            ...prev,
                            customer_id: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Priorytet</Label>
                      <Input
                        value={orderFilters.priority}
                        onChange={(event) =>
                          setOrderFilters((prev) => ({
                            ...prev,
                            priority: event.target.value,
                          }))
                        }
                        placeholder="true/false"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                      <Button onClick={() => setOrderModalOpen(true)} disabled={!canCreateOrders}>
                        Dodaj zamowienie
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border bg-white">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="px-4 py-3">Numer</th>
                            <th className="px-4 py-3">Klient</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Priorytet</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length === 0 && (
                            <tr>
                              <td className="px-4 py-6 text-muted-foreground">
                                Brak zamowien. Dodaj pierwsze zamowienie.
                              </td>
                            </tr>
                          )}
                          {data.map((order: any) => (
                            <tr
                              key={order.id}
                              className={`cursor-pointer border-b hover:bg-secondary/40 ${
                                orderSelected?.id === order.id ? "bg-secondary/40" : ""
                              }`}
                              onClick={() => handleSelectOrder(order)}
                            >
                              <td className="px-4 py-3">{order.order_no}</td>
                              <td className="px-4 py-3">ID {order.customer_id}</td>
                              <td className="px-4 py-3">{order.status}</td>
                              <td className="px-4 py-3">{order.priority ? "Tak" : "Nie"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {orderSelected && (
                    <Card className="border-0 bg-secondary/60">
                      <CardHeader>
                        <CardTitle className="text-base">Wybrane zamowienie</CardTitle>
                        <CardDescription>
                          ID {orderSelected.id} · numer {orderSelected.order_no}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Status: {orderSelected.status}
                      </CardContent>
                    </Card>
                  )}
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Operacje na zamowieniu</CardTitle>
                      <CardDescription>
                        Podaj ID zamowienia, aby je wydac, anulowac lub ustawic priorytet.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>ID zamowienia</Label>
                        <Input
                          value={orderAction.order_id}
                          onChange={(event) =>
                            setOrderAction((prev) => ({
                              ...prev,
                              order_id: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="order-priority"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={orderAction.priority}
                          onChange={(event) =>
                            setOrderAction((prev) => ({
                              ...prev,
                              priority: event.target.checked,
                            }))
                          }
                          disabled={!canManageOrderPriority}
                        />
                        <Label htmlFor="order-priority">Priorytet</Label>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-3">
                      <Button
                        variant="outline"
                        onClick={handleIssueOrder}
                        disabled={!canIssueOrders || loading || !orderAction.order_id}
                      >
                        Wydaj zamowienie
                      </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelOrder}
                          disabled={!canCancelOrders || loading || !orderAction.order_id}
                        >
                          Anuluj zamowienie
                        </Button>
                        <Button
                          onClick={handleUpdatePriority}
                          disabled={!canManageOrderPriority || loading || !orderAction.order_id}
                        >
                          Zmien priorytet
                        </Button>
                        {orderMessage && (
                          <p className="text-sm text-emerald-600">{orderMessage}</p>
                        )}
                        {!canIssueOrders && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do wydawania zamowien.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Podsumowanie zamowienia</CardTitle>
                      <CardDescription>
                        Szybki podglad realizacji i brakow na stanie.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="grid gap-2">
                          <Label>ID zamowienia</Label>
                          <Input
                            value={orderDetailId}
                            onChange={(event) => setOrderDetailId(event.target.value)}
                            placeholder="np. 12"
                          />
                        </div>
                      <Button
                        onClick={() => handleFetchOrderSummary()}
                        disabled={loading || !orderDetailId}
                      >
                        Pobierz podsumowanie
                      </Button>
                      </div>
                      {orderSummary && (
                        <div className="grid gap-4">
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span>Numer: {orderSummary.order_no}</span>
                            <span>Status: {orderSummary.status}</span>
                            <span>Priorytet: {orderSummary.priority ? "Tak" : "Nie"}</span>
                          </div>
                          <div className="flex flex-wrap items-end gap-3">
                            <div className="grid gap-2">
                              <Label>Zmien status</Label>
                              <select
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={orderStatusUpdate}
                                onChange={(event) => setOrderStatusUpdate(event.target.value)}
                              >
                                <option value="NOWE">NOWE</option>
                                <option value="OCZEKUJACE">OCZEKUJACE</option>
                                <option value="W_REALIZACJI">W_REALIZACJI</option>
                                <option value="ZREALIZOWANE">ZREALIZOWANE</option>
                                <option value="ZREALIZOWANE_CZESCIOWO">
                                  ZREALIZOWANE_CZESCIOWO
                                </option>
                                <option value="ANULOWANE">ANULOWANE</option>
                              </select>
                            </div>
                            <Button
                              onClick={handleUpdateOrderStatus}
                              disabled={loading || !canManageOrderPriority}
                            >
                              Zapisz status
                            </Button>
                          </div>
                          <div className="grid gap-2">
                            {orderSummary.items.map((item: any) => (
                              <div
                                key={item.product_id}
                                className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm"
                              >
                                <div>
                                  {item.sku} - {item.name}
                                </div>
                                <div>
                                  zamowione: {item.qty_ordered} | wydane: {item.qty_issued} |
                                  dostepne: {item.available} | braki: {item.missing}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              variant="outline"
                              onClick={handleIssueOrder}
                              disabled={!canIssueOrders || loading || !orderSummary.order_id}
                            >
                              Wydaj zamowienie
                            </Button>
                            <Button
                              onClick={handleOrderMissingToDelivery}
                              disabled={loading}
                            >
                              Zamow brakujace
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Panel 1-klik</CardTitle>
                      <CardDescription>
                        System sam zdecyduje: wydaj zamowienie albo przygotuj dostawe.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-end gap-3">
                      <div className="grid gap-2">
                        <Label>ID zamowienia</Label>
                        <Input
                          value={orderQuickId}
                          onChange={(event) => setOrderQuickId(event.target.value)}
                          placeholder="np. 12"
                        />
                      </div>
                      <Button onClick={handleQuickOrder} disabled={loading || !orderQuickId}>
                        Wykonaj 1-klik
                      </Button>
                      {orderQuickMessage && (
                        <p className="text-sm text-emerald-600">{orderQuickMessage}</p>
                      )}
                      {orderQuickSummary && (
                        <div className="grid gap-2 text-sm">
                          <p className="text-sm text-muted-foreground">
                            Braki na stanie. Przejdz do dostaw, a produkty beda juz
                            wypelnione.
                          </p>
                          {orderQuickSummary.items
                            .filter((item: any) => item.missing > 0)
                            .map((item: any) => (
                              <div
                                key={item.product_id}
                                className="rounded-md border bg-white px-3 py-2"
                              >
                                {item.sku} - braki: {item.missing}
                              </div>
                            ))}
                          <Button onClick={handleQuickToDelivery} disabled={loading}>
                            Przejdz do dostaw
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {view === "search" && (
                <div className="grid gap-4">
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Wyszukiwarka globalna</CardTitle>
                      <CardDescription>
                        Wpisz minimum 2 znaki (SKU, numer zamowienia, kod lokacji, nazwa).
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="grid gap-2">
                          <Label>Fraza</Label>
                          <Input
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="np. SKU, ORD, A1, klient"
                          />
                        </div>
                        <Button
                          onClick={handleSearch}
                          disabled={loading || searchQuery.trim().length < 2}
                        >
                          Szukaj
                        </Button>
                      </div>
                      {searchResults && (
                        <div className="grid gap-4">
                          {(
                            [
                              ["Produkty", searchResults.products],
                              ["Zamowienia", searchResults.orders],
                              ["Lokalizacje", searchResults.locations],
                              ["Klienci", searchResults.customers],
                              ["Dostawcy", searchResults.suppliers],
                              ["Dostawy", searchResults.deliveries],
                            ] as [string, any[]][]
                          ).map(([label, rows]) => (
                            <div key={label} className="grid gap-2">
                              <h3 className="text-sm font-semibold">{label}</h3>
                              <div className="grid gap-2">
                                {rows.length === 0 && (
                                  <p className="text-sm text-muted-foreground">Brak wynikow.</p>
                                )}
                                {rows.map((row: any) => (
                                  <div
                                    key={`${row.kind}-${row.id}`}
                                    className="rounded-md border bg-white px-3 py-2 text-sm"
                                  >
                                    {row.label} (ID {row.id})
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {view === "customers" && (
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="grid gap-2">
                      <Label>Szukaj klienta</Label>
                      <Input
                        value={customerSearch}
                        onChange={(event) => setCustomerSearch(event.target.value)}
                        placeholder="np. ABC Sp. z o.o."
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                      <Button
                        onClick={() => setCustomerModalOpen(true)}
                        disabled={!canManageCustomers}
                      >
                        Dodaj klienta
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border bg-white">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="px-4 py-3">Nazwa</th>
                            <th className="px-4 py-3">Kontakt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length === 0 && (
                            <tr>
                              <td className="px-4 py-6 text-muted-foreground">
                                Brak klientow. Dodaj pierwszego klienta.
                              </td>
                            </tr>
                          )}
                          {data.map((customer: any) => (
                            <tr
                              key={customer.id}
                              className="cursor-pointer border-b hover:bg-secondary/40"
                              onClick={() => handleSelectCustomer(customer)}
                            >
                              <td className="px-4 py-3">{customer.name}</td>
                              <td className="px-4 py-3">{customer.contact_data ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {customerEditForm.id && (
                    <Card className="border-0 bg-secondary/60">
                      <CardHeader>
                        <CardTitle className="text-base">Edytuj klienta</CardTitle>
                        <CardDescription>Kliknij klienta w tabeli, aby go edytowac.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>ID klienta</Label>
                          <Input value={customerEditForm.id} disabled />
                        </div>
                        <div className="grid gap-2">
                          <Label>Nazwa</Label>
                          <Input
                            value={customerEditForm.name}
                            onChange={(event) =>
                              setCustomerEditForm((prev) => ({ ...prev, name: event.target.value }))
                            }
                            disabled={!canManageCustomers}
                          />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label>Dane kontaktowe</Label>
                          <Input
                            value={customerEditForm.contact_data}
                            onChange={(event) =>
                              setCustomerEditForm((prev) => ({
                                ...prev,
                                contact_data: event.target.value,
                              }))
                            }
                            disabled={!canManageCustomers}
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                          <Button
                            onClick={handleUpdateCustomer}
                            disabled={!canManageCustomers || loading || !customerEditForm.id}
                          >
                            Zapisz zmiany
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteCustomer}
                            disabled={!canManageCustomers || loading || !customerEditForm.id}
                          >
                            Usun klienta
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {view === "suppliers" && (
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="grid gap-2">
                      <Label>Szukaj dostawcy</Label>
                      <Input
                        value={supplierSearch}
                        onChange={(event) => setSupplierSearch(event.target.value)}
                        placeholder="np. Tech Logistics"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                      <Button
                        onClick={() => setSupplierModalOpen(true)}
                        disabled={!canManageSuppliers}
                      >
                        Dodaj dostawce
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border bg-white">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="px-4 py-3">Nazwa</th>
                            <th className="px-4 py-3">Kontakt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length === 0 && (
                            <tr>
                              <td className="px-4 py-6 text-muted-foreground">
                                Brak dostawcow. Dodaj pierwszego dostawce.
                              </td>
                            </tr>
                          )}
                          {data.map((supplier: any) => (
                            <tr
                              key={supplier.id}
                              className="cursor-pointer border-b hover:bg-secondary/40"
                              onClick={() => handleSelectSupplier(supplier)}
                            >
                              <td className="px-4 py-3">{supplier.name}</td>
                              <td className="px-4 py-3">{supplier.contact_data ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {supplierEditForm.id && (
                    <Card className="border-0 bg-secondary/60">
                      <CardHeader>
                        <CardTitle className="text-base">Edytuj dostawce</CardTitle>
                        <CardDescription>
                          Kliknij dostawce w tabeli, aby go edytowac.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>ID dostawcy</Label>
                          <Input value={supplierEditForm.id} disabled />
                        </div>
                        <div className="grid gap-2">
                          <Label>Nazwa</Label>
                          <Input
                            value={supplierEditForm.name}
                            onChange={(event) =>
                              setSupplierEditForm((prev) => ({ ...prev, name: event.target.value }))
                            }
                            disabled={!canManageSuppliers}
                          />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label>Dane kontaktowe</Label>
                          <Input
                            value={supplierEditForm.contact_data}
                            onChange={(event) =>
                              setSupplierEditForm((prev) => ({
                                ...prev,
                                contact_data: event.target.value,
                              }))
                            }
                            disabled={!canManageSuppliers}
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                          <Button
                            onClick={handleUpdateSupplier}
                            disabled={!canManageSuppliers || loading || !supplierEditForm.id}
                          >
                            Zapisz zmiany
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteSupplier}
                            disabled={!canManageSuppliers || loading || !supplierEditForm.id}
                          >
                            Usun dostawce
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {view === "warehouses" && (
                <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Lista magazynow</CardTitle>
                      <CardDescription>
                        Wyszukaj i wybierz magazyn, aby otworzyc szczegoly.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Wyszukiwanie</Label>
                        <Input
                          value={warehouseQuery.q}
                          onChange={(event) =>
                            setWarehouseQuery((prev) => ({
                              ...prev,
                              q: event.target.value,
                            }))
                          }
                          placeholder="np. MAIN"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Sortowanie</Label>
                        <div className="flex flex-wrap gap-2">
                          <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={warehouseQuery.sort}
                            onChange={(event) =>
                              setWarehouseQuery((prev) => ({
                                ...prev,
                                sort: event.target.value,
                              }))
                            }
                          >
                            <option value="name">Nazwa</option>
                            <option value="total_qty">Laczna ilosc</option>
                            <option value="last_activity">Ostatnia aktywnosc</option>
                          </select>
                          <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={warehouseQuery.order}
                            onChange={(event) =>
                              setWarehouseQuery((prev) => ({
                                ...prev,
                                order: event.target.value,
                              }))
                            }
                          >
                            <option value="asc">Rosnaco</option>
                            <option value="desc">Malejaco</option>
                          </select>
                          <Button onClick={refresh} disabled={loading}>
                            Filtruj
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-[420px] overflow-auto rounded-xl border bg-white">
                        <table className="min-w-full text-left text-sm">
                          <thead className="sticky top-0 bg-white">
                            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                              <th className="px-3 py-2">Magazyn</th>
                              <th className="px-3 py-2">Lokacje</th>
                              <th className="px-3 py-2">SKU</th>
                              <th className="px-3 py-2">Ilosc</th>
                            </tr>
                          </thead>
                          <tbody>
                            {warehouseList.map((warehouse) => (
                              <tr
                                key={warehouse.id}
                                className={`cursor-pointer border-b ${
                                  warehouseSelected?.id === warehouse.id
                                    ? "bg-muted/40"
                                    : ""
                                }`}
                                onClick={() => handleSelectWarehouse(warehouse)}
                              >
                                <td className="px-3 py-2 font-medium">{warehouse.name}</td>
                                <td className="px-3 py-2">{warehouse.locations_count}</td>
                                <td className="px-3 py-2">{warehouse.sku_count}</td>
                                <td className="px-3 py-2">{warehouse.total_qty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid gap-4">
                    {warehouseSelected ? (
                      <>
                        <Card className="border-0 bg-secondary/60">
                          <CardHeader>
                              <CardTitle className="text-base">
                                {warehouseSelected.name}
                              </CardTitle>
                            <CardDescription>
                              ID {warehouseSelected.id} · ostatnia aktywnosc:{" "}
                              {warehouseSelected.last_activity_at ?? "-"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-3">
                            {[
                              ["summary", "Podsumowanie"],
                              ["stock", "Stany"],
                              ["locations", "Lokalizacje"],
                            ].map(([key, label]) => (
                              <Button
                                key={key}
                                variant={warehouseTab === key ? "default" : "outline"}
                                onClick={() => setWarehouseTab(key)}
                              >
                                {label}
                              </Button>
                            ))}
                          </CardContent>
                        </Card>
                        {warehouseTab === "summary" && (
                          <div className="grid gap-4">
                            <Card className="border-0 bg-secondary/60">
                              <CardHeader>
                                <CardTitle className="text-base">KPI</CardTitle>
                              </CardHeader>
                              <CardContent className="grid gap-3 sm:grid-cols-4">
                                <div className="rounded-md border bg-white p-3 text-sm">
                                  Lokacje: {warehouseDashboard?.kpis?.locations_count ?? 0}
                                </div>
                                <div className="rounded-md border bg-white p-3 text-sm">
                                  Zablokowane:{" "}
                                  {warehouseDashboard?.kpis?.blocked_locations_count ?? 0}
                                </div>
                                <div className="rounded-md border bg-white p-3 text-sm">
                                  SKU: {warehouseDashboard?.kpis?.sku_count ?? 0}
                                </div>
                                <div className="rounded-md border bg-white p-3 text-sm">
                                  Laczna ilosc: {warehouseDashboard?.kpis?.total_qty ?? 0}
                                </div>
                              </CardContent>
                            </Card>
                            <div className="grid gap-4 lg:grid-cols-3">
                              <Card className="border-0 bg-secondary/60">
                                <CardHeader>
                                  <CardTitle className="text-base">Top produkty</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-2">
                                  {warehouseDashboard?.top_products?.map((row: any) => (
                                    <div
                                      key={row.product_id}
                                      className="flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm"
                                    >
                                      <span>
                                        {row.sku} - {row.name}
                                      </span>
                                      <span>{row.qty_total}</span>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                              <Card className="border-0 bg-secondary/60">
                                <CardHeader>
                                  <CardTitle className="text-base">Low stock</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-2">
                                  {warehouseDashboard?.low_stock?.map((row: any) => (
                                    <div
                                      key={row.product_id}
                                      className="flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-destructive"
                                    >
                                      <span>
                                        {row.sku} - {row.name}
                                      </span>
                                      <span>{row.qty_total}</span>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                              <Card className="border-0 bg-secondary/60">
                                <CardHeader>
                                  <CardTitle className="text-base">Zablokowane lokacje</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-2">
                                  {warehouseDashboard?.blocked_locations?.map((row: any) => (
                                    <div
                                      key={row.location_id}
                                      className="flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm"
                                    >
                                      <span>{row.code}</span>
                                      <span>{row.items_count}</span>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        )}
                        {warehouseTab === "stock" && (
                          <div className="grid gap-4">
                            <Card className="border-0 bg-secondary/60">
                              <CardHeader>
                                <CardTitle className="text-base">Stany magazynowe</CardTitle>
                                <CardDescription>
                                  Kliknij produkt, aby zobaczyc lokacje.
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-4">
                                <div className="flex flex-wrap items-end gap-3">
                                  <div className="grid gap-2">
                                    <Label>Szukaj produktu</Label>
                                    <Input
                                      value={warehouseStockQuery.q}
                                      onChange={(event) =>
                                        setWarehouseStockQuery((prev) => ({
                                          ...prev,
                                          q: event.target.value,
                                          page: 1,
                                        }))
                                      }
                                      placeholder="SKU lub nazwa"
                                    />
                                  </div>
                                  <Button
                                    onClick={() =>
                                      handleLoadWarehouseDetails(String(warehouseSelected.id))
                                    }
                                    disabled={loading}
                                  >
                                    Filtruj
                                  </Button>
                                </div>
                                <div className="max-h-[360px] overflow-auto rounded-xl border bg-white">
                                  <table className="min-w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-white">
                                      <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-3 py-2">SKU</th>
                                        <th className="px-3 py-2">Produkt</th>
                                        <th className="px-3 py-2">Ilosc</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[...warehouseStock]
                                        .sort((a: any, b: any) => {
                                          const aLow = a.qty_total <= lowStockThreshold ? 1 : 0;
                                          const bLow = b.qty_total <= lowStockThreshold ? 1 : 0;
                                          if (aLow !== bLow) return bLow - aLow;
                                          return b.qty_total - a.qty_total;
                                        })
                                        .map((row: any) => (
                                        <tr
                                          key={row.product_id}
                                          className={`cursor-pointer border-b ${
                                            row.qty_total <= lowStockThreshold
                                              ? "bg-destructive/10"
                                              : ""
                                          }`}
                                          onClick={() => handleLoadProductLocations(row.product_id)}
                                        >
                                          <td className="px-3 py-2">{row.sku}</td>
                                          <td className="px-3 py-2">{row.name}</td>
                                          <td className="px-3 py-2">{row.qty_total}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                  <Button
                                    variant="outline"
                                    disabled={warehouseStockQuery.page <= 1}
                                    onClick={() =>
                                      setWarehouseStockQuery((prev) => ({
                                        ...prev,
                                        page: Math.max(1, prev.page - 1),
                                      }))
                                    }
                                  >
                                    Poprzednia
                                  </Button>
                                  <Button
                                    variant="outline"
                                    disabled={
                                      warehouseStockQuery.page * warehouseStockQuery.page_size >=
                                      warehouseStockTotal
                                    }
                                    onClick={() =>
                                      setWarehouseStockQuery((prev) => ({
                                        ...prev,
                                        page: prev.page + 1,
                                      }))
                                    }
                                  >
                                    Nastepna
                                  </Button>
                                  <span>
                                    Strona {warehouseStockQuery.page} · {warehouseStockTotal} wynikow
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                            {warehouseProductLocations.length > 0 && (
                              <Card className="border-0 bg-secondary/60">
                                <CardHeader>
                                  <CardTitle className="text-base">Lokalizacje produktu</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-2">
                                  {warehouseProductLocations.map((row: any) => (
                                    <div
                                      key={row.location_id}
                                      className="flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm"
                                    >
                                      <span>{row.code}</span>
                                      <span>{row.quantity}</span>
                                      <span>{row.is_blocked ? "Zablokowana" : "OK"}</span>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        )}
                        {warehouseTab === "locations" && (
                          <div className="grid gap-4">
                            <Card className="border-0 bg-secondary/60">
                              <CardHeader>
                                <CardTitle className="text-base">Lokalizacje</CardTitle>
                                <CardDescription>
                                  Lokacja to konkretne miejsce w magazynie (regal, polka,
                                  gniazdo). Status: FREE / OCCUPIED / BLOCKED.
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-4">
                                <div className="flex flex-wrap items-end gap-3">
                                  <div className="grid gap-2">
                                    <Label>Filtr kodu</Label>
                                    <Input
                                      value={warehouseLocationFilter}
                                      onChange={(event) =>
                                        setWarehouseLocationFilter(event.target.value)
                                      }
                                      placeholder="np. A1"
                                    />
                                  </div>
                                </div>
                                <div className="max-h-[360px] overflow-auto rounded-xl border bg-white">
                                  <table className="min-w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-white">
                                      <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-3 py-2">Kod</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Pozycje</th>
                                        <th className="px-3 py-2">Podglad</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {warehouseLocations
                                        .filter((loc: any) =>
                                          warehouseLocationFilter
                                            ? loc.code
                                                .toLowerCase()
                                                .startsWith(
                                                  warehouseLocationFilter.toLowerCase()
                                                )
                                            : true
                                        )
                                        .sort((a: any, b: any) => {
                                          const orderMap: Record<string, number> = {
                                            BLOCKED: 0,
                                            OCCUPIED: 1,
                                            FREE: 2,
                                          };
                                          return orderMap[a.status] - orderMap[b.status];
                                        })
                                        .map((loc: any) => (
                                          <tr
                                            key={loc.location_id}
                                            className={`border-b ${
                                              loc.status === "BLOCKED"
                                                ? "bg-destructive/10"
                                                : ""
                                            }`}
                                          >
                                            <td className="px-3 py-2">{loc.code}</td>
                                            <td className="px-3 py-2">{loc.status}</td>
                                            <td className="px-3 py-2">{loc.items_count}</td>
                                            <td className="px-3 py-2">
                                              {loc.items_preview?.join(", ") || "-"}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </CardContent>
                            </Card>
                            {canManageLocationsAdmin && (
                              <Card className="border-0 bg-secondary/60">
                                <CardHeader>
                                  <CardTitle className="text-base">Zarzadzanie lokacjami</CardTitle>
                                  <CardDescription>Tylko ADMIN.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label>Magazyn</Label>
                                      <select
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={locationForm.warehouse_id}
                                        onChange={(event) =>
                                          setLocationForm((prev) => ({
                                            ...prev,
                                            warehouse_id: event.target.value,
                                          }))
                                        }
                                      >
                                        <option value="">Wybierz magazyn...</option>
                                        {warehouseList.map((warehouse) => (
                                          <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name} (ID {warehouse.id})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Kod lokacji</Label>
                                      <Input
                                        value={locationForm.code}
                                        onChange={(event) =>
                                          setLocationForm((prev) => ({
                                            ...prev,
                                            code: event.target.value,
                                          }))
                                        }
                                        placeholder="np. A1-01-01"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Opis</Label>
                                      <Input
                                        value={locationForm.description}
                                        onChange={(event) =>
                                          setLocationForm((prev) => ({
                                            ...prev,
                                            description: event.target.value,
                                          }))
                                        }
                                        placeholder="np. regal A, poziom 1"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Typ</Label>
                                      <Input
                                        value={locationForm.kind}
                                        onChange={(event) =>
                                          setLocationForm((prev) => ({
                                            ...prev,
                                            kind: event.target.value,
                                          }))
                                        }
                                        placeholder="RACK_CELL"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        id="location-blocked"
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={locationForm.is_blocked}
                                        onChange={(event) =>
                                          setLocationForm((prev) => ({
                                            ...prev,
                                            is_blocked: event.target.checked,
                                          }))
                                        }
                                      />
                                      <Label htmlFor="location-blocked">Zablokowana</Label>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3">
                                    <Button onClick={handleCreateLocation} disabled={loading}>
                                      Dodaj lokacje
                                    </Button>
                                    {locationFormMessage && (
                                      <p className="text-sm text-emerald-600">
                                        {locationFormMessage}
                                      </p>
                                    )}
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label>Edytuj lokacje</Label>
                                      <select
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={locationEditForm.id}
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          setLocationEditForm((prev) => ({
                                            ...prev,
                                            id: value,
                                          }));
                                          handleLoadLocationForEdit(value);
                                        }}
                                      >
                                        <option value="">Wybierz lokacje...</option>
                                        {warehouseLocations.map((location) => (
                                          <option
                                            key={location.location_id}
                                            value={location.location_id}
                                          >
                                            {location.code} (ID {location.location_id})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>ID lokacji</Label>
                                      <Input value={locationEditForm.id} disabled />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Magazyn</Label>
                                      <select
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={locationEditForm.warehouse_id}
                                        onChange={(event) =>
                                          setLocationEditForm((prev) => ({
                                            ...prev,
                                            warehouse_id: event.target.value,
                                          }))
                                        }
                                      >
                                        <option value="">Wybierz magazyn...</option>
                                        {warehouseList.map((warehouse) => (
                                          <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name} (ID {warehouse.id})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Kod lokacji</Label>
                                      <Input
                                        value={locationEditForm.code}
                                        onChange={(event) =>
                                          setLocationEditForm((prev) => ({
                                            ...prev,
                                            code: event.target.value,
                                          }))
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Opis</Label>
                                      <Input
                                        value={locationEditForm.description}
                                        onChange={(event) =>
                                          setLocationEditForm((prev) => ({
                                            ...prev,
                                            description: event.target.value,
                                          }))
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Typ</Label>
                                      <Input
                                        value={locationEditForm.kind}
                                        onChange={(event) =>
                                          setLocationEditForm((prev) => ({
                                            ...prev,
                                            kind: event.target.value,
                                          }))
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        id="edit-location-blocked"
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={locationEditForm.is_blocked}
                                        onChange={(event) =>
                                          setLocationEditForm((prev) => ({
                                            ...prev,
                                            is_blocked: event.target.checked,
                                          }))
                                        }
                                      />
                                      <Label htmlFor="edit-location-blocked">Zablokowana</Label>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3">
                                    <Button
                                      onClick={handleUpdateLocation}
                                      disabled={loading || !locationEditForm.id}
                                    >
                                      Zapisz zmiany
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={handleDeleteLocation}
                                      disabled={loading || !locationEditForm.id}
                                    >
                                      Usun lokacje
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                            <Card className="border-0 bg-secondary/60">
                              <CardHeader>
                                <CardTitle className="text-base">
                                  Blokada lokacji i lock layoutu
                                </CardTitle>
                                <CardDescription>
                                  Blokada lokacji wstrzymuje prace na konkretnej polce.
                                  Lock layoutu chroni caly uklad magazynu przed
                                  rownoczesna edycja.
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label>Lokacja do blokady</Label>
                                    <Input
                                      value={locationSelectSearch}
                                      onChange={(event) =>
                                        setLocationSelectSearch(event.target.value)
                                      }
                                      placeholder="Filtr po kodzie (np. A1)"
                                    />
                                    <select
                                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                      value={warehouseView.location_id}
                                      onChange={(event) => handleSelectBlockLocation(event.target.value)}
                                    >
                                      <option value="">Wybierz lokacje...</option>
                                      {warehouseLocations
                                        .filter((location: any) =>
                                          locationSelectSearch
                                            ? String(location.code)
                                                .toLowerCase()
                                                .startsWith(locationSelectSearch.toLowerCase())
                                            : true
                                        )
                                        .slice(0, 80)
                                        .map((location: any) => (
                                          <option
                                            key={location.location_id}
                                            value={location.location_id}
                                          >
                                            {location.code} (ID {location.location_id})
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      id="block-location"
                                      type="checkbox"
                                      className="h-4 w-4"
                                      checked={warehouseView.is_blocked}
                                      onChange={(event) =>
                                        setWarehouseView((prev) => ({
                                          ...prev,
                                          is_blocked: event.target.checked,
                                        }))
                                      }
                                      disabled={!canManageLocations}
                                    />
                                    <Label htmlFor="block-location">Zablokuj lokacje</Label>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                                    <Button
                                      onClick={handleBlockLocation}
                                      disabled={
                                        !canManageLocations || loading || !warehouseView.location_id
                                      }
                                    >
                                      Zapisz blokade
                                    </Button>
                                    {!canManageLocations && (
                                      <p className="text-sm text-muted-foreground">
                                        Brak uprawnien do blokowania lokacji.
                                      </p>
                                    )}
                                    {warehouseMessage && (
                                      <p className="text-sm text-emerald-600">{warehouseMessage}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label>Magazyn do locka</Label>
                                    <select
                                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                      value={warehouseView.warehouse_id}
                                      onChange={(event) =>
                                        setWarehouseView((prev) => ({
                                          ...prev,
                                          warehouse_id: event.target.value,
                                        }))
                                      }
                                    >
                                      <option value="">Wybierz magazyn...</option>
                                      {warehouseList.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                          {warehouse.name} (ID {warehouse.id})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Status locka layoutu</Label>
                                    <div className="rounded-md border bg-white px-3 py-2 text-sm">
                                      {layoutLock
                                        ? `LOCK ${layoutLock.lock_id} (uzytkownik ${layoutLock.locked_by})`
                                        : "Brak aktywnego locka"}
                                    </div>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Wygasa</Label>
                                    <div className="rounded-md border bg-white px-3 py-2 text-sm">
                                      {layoutLock?.expires_at ?? "-"}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                                    <Button
                                      onClick={handleFetchLock}
                                      disabled={loading || !warehouseView.warehouse_id}
                                    >
                                      Podglad locka
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={handleAcquireLock}
                                      disabled={
                                        !canManageLocations || loading || !warehouseView.warehouse_id
                                      }
                                    >
                                      Zaloz lock
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={handleRefreshLock}
                                      disabled={!canManageLocations || loading || !layoutLock?.lock_id}
                                    >
                                      Odswiez lock
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={handleReleaseLock}
                                      disabled={!canManageLocations || loading || !layoutLock?.lock_id}
                                    >
                                      Zwolnij lock
                                    </Button>
                                    {layoutLockMessage && (
                                      <p className="text-sm text-emerald-600">{layoutLockMessage}</p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                        {canManageWarehouses && (
                          <Card className="border-0 bg-secondary/60">
                            <CardHeader>
                              <CardTitle className="text-base">Dodaj magazyn</CardTitle>
                              <CardDescription>Tylko ADMIN.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                              <div className="grid gap-2">
                                <Label>Nazwa</Label>
                                <Input
                                  value={warehouseForm.name}
                                  onChange={(event) =>
                                    setWarehouseForm((prev) => ({
                                      ...prev,
                                      name: event.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Skala jednostki</Label>
                                <Input
                                  value={warehouseForm.unit_scale}
                                  onChange={(event) =>
                                    setWarehouseForm((prev) => ({
                                      ...prev,
                                      unit_scale: event.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                                <Button onClick={handleCreateWarehouse} disabled={loading}>
                                  Dodaj magazyn
                                </Button>
                                {warehouseFormMessage && (
                                  <p className="text-sm text-emerald-600">
                                    {warehouseFormMessage}
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {canManageWarehouses && (
                          <Card className="border-0 bg-secondary/60">
                            <CardHeader>
                              <CardTitle className="text-base">Edytuj magazyn</CardTitle>
                              <CardDescription>Wybierz magazyn z listy.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                              <div className="grid gap-2">
                                <Label>ID magazynu</Label>
                                <Input
                                  value={warehouseEditForm.id}
                                  onChange={(event) =>
                                    setWarehouseEditForm((prev) => ({
                                      ...prev,
                                      id: event.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Nowa nazwa</Label>
                                <Input
                                  value={warehouseEditForm.name}
                                  onChange={(event) =>
                                    setWarehouseEditForm((prev) => ({
                                      ...prev,
                                      name: event.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="grid gap-2 md:col-span-2">
                                <Label>Nowa skala jednostki</Label>
                                <Input
                                  value={warehouseEditForm.unit_scale}
                                  onChange={(event) =>
                                    setWarehouseEditForm((prev) => ({
                                      ...prev,
                                      unit_scale: event.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                                <Button
                                  onClick={handleUpdateWarehouse}
                                  disabled={loading || !warehouseEditForm.id}
                                >
                                  Zapisz zmiany
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    ) : (
                      <Card className="border-0 bg-secondary/60">
                        <CardHeader>
                          <CardTitle className="text-base">Brak magazynu</CardTitle>
                          <CardDescription>Wybierz magazyn z listy.</CardDescription>
                        </CardHeader>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {view === "admin" && (
                <div className="grid gap-4">
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Dodaj uzytkownika</CardTitle>
                      <CardDescription>Wymagana rola ADMIN.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Login</Label>
                        <Input
                          value={adminUserForm.login}
                          onChange={(event) =>
                            setAdminUserForm((prev) => ({ ...prev, login: event.target.value }))
                          }
                          disabled={!canManageAdmin}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Haslo</Label>
                        <Input
                          type="password"
                          value={adminUserForm.password}
                          onChange={(event) =>
                            setAdminUserForm((prev) => ({ ...prev, password: event.target.value }))
                          }
                          disabled={!canManageAdmin}
                        />
                      </div>
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Rola</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={adminUserForm.role}
                          onChange={(event) =>
                            setAdminUserForm((prev) => ({ ...prev, role: event.target.value }))
                          }
                          disabled={!canManageAdmin}
                        >
                          <option value="MAGAZYNIER">MAGAZYNIER</option>
                          <option value="KIEROWNIK">KIEROWNIK</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button onClick={handleCreateAdminUser} disabled={!canManageAdmin || loading}>
                          Dodaj
                        </Button>
                        {!canManageAdmin && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do zarzadzania uzytkownikami.
                          </p>
                        )}
                        {adminMessage && (
                          <p className="text-sm text-emerald-600">{adminMessage}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Aktualizuj uzytkownika</CardTitle>
                      <CardDescription>
                        Ustaw role, aktywnosc lub nowe haslo.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>ID uzytkownika</Label>
                        <Input
                          value={adminUpdateForm.user_id}
                          onChange={(event) =>
                            setAdminUpdateForm((prev) => ({
                              ...prev,
                              user_id: event.target.value,
                            }))
                          }
                          disabled={!canManageAdmin}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Rola</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={adminUpdateForm.role}
                          onChange={(event) =>
                            setAdminUpdateForm((prev) => ({
                              ...prev,
                              role: event.target.value,
                            }))
                          }
                          disabled={!canManageAdmin}
                        >
                          <option value="MAGAZYNIER">MAGAZYNIER</option>
                          <option value="KIEROWNIK">KIEROWNIK</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Nowe haslo (opcjonalnie)</Label>
                        <Input
                          type="password"
                          value={adminUpdateForm.password}
                          onChange={(event) =>
                            setAdminUpdateForm((prev) => ({
                              ...prev,
                              password: event.target.value,
                            }))
                          }
                          disabled={!canManageAdmin}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="admin-active"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={adminUpdateForm.is_active}
                          onChange={(event) =>
                            setAdminUpdateForm((prev) => ({
                              ...prev,
                              is_active: event.target.checked,
                            }))
                          }
                          disabled={!canManageAdmin}
                        />
                        <Label htmlFor="admin-active">Aktywny</Label>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button onClick={handleUpdateAdminUser} disabled={!canManageAdmin || loading}>
                          Zapisz zmiany
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {view === "reports" && (
                <div className="grid gap-4">
                  <div className="flex flex-wrap gap-3">
                    {["stock", "deliveries", "orders", "audit"].map((type) => (
                    <Button
                      key={type}
                      variant={reportType === type ? "default" : "outline"}
                      onClick={() => setReportType(type)}
                    >
                      {type.toUpperCase()}
                    </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Raporty prezentuja dane przekrojowe. Wybierz typ raportu, ustaw filtry,
                    a nastepnie kliknij „Filtruj”.
                  </p>
                  {reportType === "audit" && (
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="grid gap-2">
                        <Label>Akcja</Label>
                        <Input
                          value={reportFilters.action}
                          onChange={(event) =>
                            setReportFilters((prev) => ({ ...prev, action: event.target.value }))
                          }
                          placeholder="LOGIN_OK"
                        />
                        <p className="text-xs text-muted-foreground">
                          Np. LOGIN_OK, CREATE_ORDER, ISSUE_ORDER.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label>ID uzytkownika</Label>
                        <Input
                          value={reportFilters.user_id}
                          onChange={(event) =>
                            setReportFilters((prev) => ({ ...prev, user_id: event.target.value }))
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Filtruj zdarzenia konkretnego uzytkownika.
                        </p>
                      </div>
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                    </div>
                  )}
                  {reportType === "deliveries" && (
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <Input
                          value={reportFilters.status}
                          onChange={(event) =>
                            setReportFilters((prev) => ({ ...prev, status: event.target.value }))
                          }
                          placeholder="ZATWIERDZONA"
                        />
                        <p className="text-xs text-muted-foreground">
                          Np. NOWA, W_TRAKCIE, ZATWIERDZONA, ANULOWANA.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label>ID dostawcy</Label>
                        <Input
                          value={reportFilters.supplier_id}
                          onChange={(event) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              supplier_id: event.target.value,
                            }))
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Numer dostawcy z listy dostawcow.
                        </p>
                      </div>
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                    </div>
                  )}
                  {reportType === "orders" && (
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <Input
                          value={reportFilters.status}
                          onChange={(event) =>
                            setReportFilters((prev) => ({ ...prev, status: event.target.value }))
                          }
                          placeholder="ZREALIZOWANE"
                        />
                        <p className="text-xs text-muted-foreground">
                          Np. NOWE, OCZEKUJACE, ZREALIZOWANE, ANULOWANE.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label>ID klienta</Label>
                        <Input
                          value={reportFilters.customer_id}
                          onChange={(event) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              customer_id: event.target.value,
                            }))
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Numer klienta z listy klientów.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label>Priorytet</Label>
                        <Input
                          value={reportFilters.priority}
                          onChange={(event) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              priority: event.target.value,
                            }))
                          }
                          placeholder="true/false"
                        />
                        <p className="text-xs text-muted-foreground">
                          true = priorytetowe, false = standardowe.
                        </p>
                      </div>
                      <Button onClick={refresh} disabled={loading}>
                        Filtruj
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <Label>Limit wynikow</Label>
                    {(() => {
                      const pageInfo = getPaginationInfo();
                      return (
                        <>
                          <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={pagination.limit}
                            onChange={(event) =>
                              setPagination({
                                page: 1,
                                limit: Number(event.target.value),
                              })
                            }
                          >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                page: Math.max(1, pageInfo.currentPage - 1),
                              }))
                            }
                            disabled={pageInfo.currentPage <= 1}
                          >
                            Poprzednia
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                page: Math.min(pageInfo.totalPages, pageInfo.currentPage + 1),
                              }))
                            }
                            disabled={pageInfo.currentPage >= pageInfo.totalPages}
                          >
                            Nastepna
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Strona {pageInfo.currentPage} / {pageInfo.totalPages}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {view === "dashboard" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data.map((entry, index) => (
                      <Card
                        key={`${entry?.label ?? "metric"}-${index}`}
                        className="border-0 bg-secondary/60"
                      >
                        <CardHeader>
                          <CardTitle className="text-sm uppercase text-muted-foreground">
                            {entry.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                          {entry.value}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : view === "warehouses" ||
                  view === "stock" ||
                  view === "products" ||
                  view === "deliveries" ||
                  view === "orders" ||
                  view === "customers" ||
                  view === "suppliers" ? null : (
                  renderDataTable()
                )}
              </div>
            </section>
          </div>
        )}
        <datalist id="product-skus">
          {lookups.products.map((product) => (
            <option key={product.id} value={product.sku}>
              {product.sku} - {product.name}
            </option>
          ))}
        </datalist>
        <datalist id="location-codes">
          {lookups.locations
            .filter((location) =>
              deliveryWarehouseId ? String(location.warehouse_id) === deliveryWarehouseId : true
            )
            .map((location) => (
            <option key={location.id} value={location.code}>
              {location.code}
            </option>
          ))}
        </datalist>
      </div>
    </main>
  );
}
