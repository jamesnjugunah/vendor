import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Navigation, 
  Building2, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertTriangle,
  X,
  Loader2
} from 'lucide-react';
import { branches, type Branch } from '@/lib/store';
import { toast } from 'sonner';

interface DeliveryAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedBranch: Branch;
  onValidationChange?: (isValid: boolean) => void;
  onBranchSwitch?: (branchId: Branch) => void;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  buildingNumber?: string;
  instructions?: string;
  imageUrl?: string;
}

const DeliveryAddressInput = ({ 
  value, 
  onChange, 
  selectedBranch,
  onValidationChange,
  onBranchSwitch
}: DeliveryAddressInputProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [buildingNumber, setBuildingNumber] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [suggestedBranch, setSuggestedBranch] = useState<Branch | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Branch coordinates (approximate - you'd use real coordinates)
  const branchCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'Nairobi HQ': { lat: -1.286389, lng: 36.817223 },
    'Mombasa Branch': { lat: -4.043740, lng: 39.668206 },
    'Kisumu Branch': { lat: -0.091702, lng: 34.767956 },
    'Nakuru Branch': { lat: -0.303099, lng: 36.080026 },
    'Eldoret Branch': { lat: 0.514277, lng: 35.269779 },
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find closest branch
  const findClosestBranch = (lat: number, lng: number): Branch | null => {
    let closestBranch: Branch | null = null;
    let minDistance = Infinity;

    branches.forEach(branch => {
      const branchCoord = branchCoordinates[branch.name];
      if (branchCoord) {
        const distance = calculateDistance(lat, lng, branchCoord.lat, branchCoord.lng);
        if (distance < minDistance) {
          minDistance = distance;
          closestBranch = branch;
        }
      }
    });

    return closestBranch;
  };

  // Validate location against selected branch
  const validateLocation = async (lat: number, lng: number) => {
    setValidationStatus('validating');
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Always find the closest branch first
    const closestBranch = findClosestBranch(lat, lng);
    
    if (!closestBranch) {
      setValidationStatus('invalid');
      setValidationMessage('Unable to validate location');
      onValidationChange?.(false);
      return;
    }

    const closestBranchCoord = branchCoordinates[closestBranch.name];
    const distanceToClosest = calculateDistance(lat, lng, closestBranchCoord.lat, closestBranchCoord.lng);
    const MAX_DELIVERY_DISTANCE = 15; // 15km radius

    // Check if closest branch is within delivery range
    if (distanceToClosest <= MAX_DELIVERY_DISTANCE) {
      // If closest branch is different from selected, suggest switching
      if (closestBranch.id !== selectedBranch.id) {
        setValidationStatus('valid');
        setValidationMessage(`✓ Location detected (${distanceToClosest.toFixed(1)}km away)`);
        setSuggestedBranch(closestBranch);
        onValidationChange?.(true);
      } else {
        setValidationStatus('valid');
        setValidationMessage(`✓ Within delivery range (${distanceToClosest.toFixed(1)}km from ${selectedBranch.name})`);
        setSuggestedBranch(null);
        onValidationChange?.(true);
      }
    } else {
      // Even closest branch is too far
      setValidationStatus('invalid');
      setValidationMessage(`Location is ${distanceToClosest.toFixed(1)}km from nearest branch ${closestBranch.name} (max: ${MAX_DELIVERY_DISTANCE}km)`);
      setSuggestedBranch(null);
      onValidationChange?.(false);
    }
  };

  const handleSwitchBranch = () => {
    if (suggestedBranch && onBranchSwitch) {
      onBranchSwitch(suggestedBranch);
      setSuggestedBranch(null);
      toast.success(`Switched to ${suggestedBranch.name}`);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get address
        try {
          // Using a free geocoding service (in production, use Google Maps Geocoding API)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          setLocation({
            latitude,
            longitude,
            address,
          });

          // Validate location
          await validateLocation(latitude, longitude);
          
          toast.success('Location detected successfully');
        } catch (error) {
          toast.error('Failed to get address details');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error('Unable to get your location. Please enter manually.');
      }
    );
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        toast.success('Image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  // Update the full address string
  useEffect(() => {
    if (location) {
      const parts = [
        location.address,
        buildingNumber && `Building/Apt: ${buildingNumber}`,
        instructions && `Instructions: ${instructions}`,
        `📍 Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
      ].filter(Boolean);
      
      onChange(parts.join('\n'));
    }
  }, [location, buildingNumber, instructions]);

  // Open Google Maps
  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-base font-semibold">
            <MapPin className="h-5 w-5 text-primary" />
            Delivery Location
          </Label>
          {location && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLocation(null);
                setValidationStatus('idle');
                setImagePreview(null);
                setBuildingNumber('');
                setInstructions('');
                onChange('');
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Current Branch Info */}
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            We'll deliver from <span className="font-semibold">{selectedBranch.name}</span> to your location
          </AlertDescription>
        </Alert>

        {/* Location Actions */}
        {!location ? (
          <div className="space-y-3">
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full"
              size="lg"
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting your location...
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Use My Current Location
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or enter your address manually</span>
              </div>
            </div>

            <Textarea
              placeholder="Enter your delivery address manually...&#10;&#10;Example:&#10;123 Main Street, Apartment 4B&#10;Near City Mall&#10;Nairobi"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Validation Status */}
            {validationStatus === 'validating' && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Validating delivery location...</AlertDescription>
              </Alert>
            )}

            {validationStatus === 'valid' && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {validationMessage}
                </AlertDescription>
              </Alert>
            )}

            {validationStatus === 'invalid' && (
              <Alert className="border-red-500 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {validationMessage}
                </AlertDescription>
              </Alert>
            )}

            {validationStatus === 'valid' && suggestedBranch && (
              <Alert className="border-blue-500 bg-blue-50">
                <MapPin className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Closer Branch Available:</strong> {suggestedBranch.name} ({suggestedBranch.location}) is closest to your location.
                  <div className="mt-2">
                    <Button
                      size="sm"
                      onClick={handleSwitchBranch}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Switch to {suggestedBranch.name}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Detected Address */}
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Your Current Location:</p>
              <p className="text-sm text-muted-foreground">{location.address}</p>
              <Button
                variant="link"
                size="sm"
                onClick={openInGoogleMaps}
                className="p-0 h-auto mt-2"
              >
                View on Google Maps →
              </Button>
            </div>

            {/* Building Number */}
            <div className="space-y-2">
              <Label htmlFor="building" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Building/Apartment Number (Optional)
              </Label>
              <Input
                id="building"
                placeholder="e.g., Building 4B, Apartment 203"
                value={buildingNumber}
                onChange={(e) => setBuildingNumber(e.target.value)}
              />
            </div>

            {/* Delivery Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">
                Delivery Instructions (Optional)
              </Label>
              <Textarea
                id="instructions"
                placeholder="e.g., Gate code: #1234, Ring doorbell twice, Leave at reception"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Location Photo (Optional)
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {imagePreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setImagePreview(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Location preview"
                  className="w-full h-48 object-cover rounded-lg border-2"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Upload a photo of your building or landmark (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryAddressInput;
