import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { 
  Gift, 
  Coffee, 
  Laptop, 
  Ticket, 
  ShoppingBag, 
  Star,
  Clock,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface MarketplaceProps {
  userPoints: number;
  onPurchase: (cost: number) => boolean;
}

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  pointsCost: number;
  icon: typeof Gift;
  color: string;
  stock: number | "unlimited";
  tier?: string;
}

interface Purchase {
  id: string;
  itemName: string;
  pointsCost: number;
  date: string;
  status: "pending" | "redeemed";
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: "1",
    name: "Coffee Voucher",
    description: "$10 gift card for coffee shop",
    category: "food",
    pointsCost: 50,
    icon: Coffee,
    color: "from-amber-500 to-orange-500",
    stock: 25,
  },
  {
    id: "2",
    name: "Extra Day Off",
    description: "One additional paid day off",
    category: "time-off",
    pointsCost: 500,
    icon: Clock,
    color: "from-blue-500 to-cyan-500",
    stock: 5,
  },
  {
    id: "3",
    name: "Tech Gadget",
    description: "Wireless earbuds or similar",
    category: "electronics",
    pointsCost: 300,
    icon: Laptop,
    color: "from-purple-500 to-pink-500",
    stock: 10,
  },
  {
    id: "4",
    name: "Event Tickets",
    description: "Concert or sports event tickets",
    category: "entertainment",
    pointsCost: 400,
    icon: Ticket,
    color: "from-green-500 to-emerald-500",
    stock: 8,
  },
  {
    id: "5",
    name: "Gift Card $25",
    description: "Amazon or similar retailer",
    category: "gift-cards",
    pointsCost: 100,
    icon: Gift,
    color: "from-red-500 to-pink-500",
    stock: "unlimited",
  },
  {
    id: "6",
    name: "Gift Card $50",
    description: "Amazon or similar retailer",
    category: "gift-cards",
    pointsCost: 200,
    icon: Gift,
    color: "from-indigo-500 to-purple-500",
    stock: "unlimited",
  },
  {
    id: "7",
    name: "Shopping Spree",
    description: "$200 shopping voucher",
    category: "shopping",
    pointsCost: 750,
    icon: ShoppingBag,
    color: "from-pink-500 to-rose-500",
    stock: 3,
    tier: "Gold",
  },
  {
    id: "8",
    name: "Premium Parking",
    description: "1 month premium parking spot",
    category: "perks",
    pointsCost: 150,
    icon: Star,
    color: "from-yellow-500 to-amber-500",
    stock: 6,
  },
  {
    id: "9",
    name: "Lunch with CEO",
    description: "Exclusive lunch meeting",
    category: "experience",
    pointsCost: 1000,
    icon: Star,
    color: "from-purple-600 to-pink-600",
    stock: 2,
    tier: "Platinum",
  },
];

const initialPurchases: Purchase[] = [
  {
    id: "1",
    itemName: "Coffee Voucher",
    pointsCost: 50,
    date: "2024-01-28",
    status: "redeemed",
  },
  {
    id: "2",
    itemName: "Gift Card $25",
    pointsCost: 100,
    date: "2024-01-15",
    status: "redeemed",
  },
];

export function Marketplace({ userPoints, onPurchase }: MarketplaceProps) {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Items" },
    { id: "gift-cards", label: "Gift Cards" },
    { id: "food", label: "Food & Drinks" },
    { id: "electronics", label: "Electronics" },
    { id: "entertainment", label: "Entertainment" },
    { id: "time-off", label: "Time Off" },
    { id: "perks", label: "Perks" },
    { id: "experience", label: "Experiences" },
  ];

  const filteredItems = selectedCategory === "all" 
    ? marketplaceItems 
    : marketplaceItems.filter(item => item.category === selectedCategory);

  const handlePurchaseClick = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedItem) return;

    if (userPoints < selectedItem.pointsCost) {
      toast.error("Insufficient points!");
      return;
    }

    const success = onPurchase(selectedItem.pointsCost);
    
    if (success) {
      const newPurchase: Purchase = {
        id: (purchases.length + 1).toString(),
        itemName: selectedItem.name,
        pointsCost: selectedItem.pointsCost,
        date: new Date().toISOString().split('T')[0],
        status: "pending",
      };

      setPurchases([newPurchase, ...purchases]);
      toast.success(`Successfully purchased ${selectedItem.name}!`, {
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      });
      setIsDialogOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Marketplace</h2>
            <p className="text-gray-500 mt-1">Redeem your points for rewards</p>
          </div>
          <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <p className="text-sm opacity-90">Available Points</p>
            <p className="text-3xl font-bold">{userPoints}</p>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="shop" className="space-y-6">
        <TabsList>
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="history">Purchase History</TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const canAfford = userPoints >= item.pointsCost;
              const isOutOfStock = item.stock !== "unlimited" && item.stock === 0;

              return (
                <Card
                  key={item.id}
                  className={`overflow-hidden ${!canAfford || isOutOfStock ? 'opacity-60' : ''}`}
                >
                  <div className={`h-32 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                      {item.tier && (
                        <Badge variant="secondary" className="text-xs">{item.tier}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-purple-600 font-bold text-lg">
                        <Star className="w-5 h-5 fill-purple-600" />
                        <span>{item.pointsCost}</span>
                      </div>
                      {item.stock !== "unlimited" && (
                        <span className="text-sm text-gray-500">
                          {item.stock} left
                        </span>
                      )}
                    </div>

                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => handlePurchaseClick(item)}
                      disabled={!canAfford || isOutOfStock}
                    >
                      {isOutOfStock ? "Out of Stock" : canAfford ? "Redeem" : "Not Enough Points"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {purchases.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No purchases yet</p>
            </Card>
          ) : (
            purchases.map((purchase) => (
              <Card key={purchase.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{purchase.itemName}</h3>
                    <p className="text-sm text-gray-500 mt-1">Purchased on {purchase.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-purple-600 font-semibold">{purchase.pointsCost} points</p>
                      <Badge 
                        variant={purchase.status === "redeemed" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this item?
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <div className={`h-32 bg-gradient-to-br ${selectedItem.color} rounded-lg flex items-center justify-center mb-4`}>
                {(() => {
                  const Icon = selectedItem.icon;
                  return <Icon className="w-16 h-16 text-white" />;
                })()}
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-2">{selectedItem.name}</h3>
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-bold text-purple-600 text-lg">{selectedItem.pointsCost} points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Balance:</span>
                  <span className="font-semibold text-gray-900">{userPoints} points</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-600">After Purchase:</span>
                  <span className="font-semibold text-gray-900">{userPoints - selectedItem.pointsCost} points</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={handleConfirmPurchase}
                >
                  Confirm Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
