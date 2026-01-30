import { supabase } from '../config/database';

/**
 * Clean up pending orders older than 10 minutes
 * Marks them as 'cancelled' to free up the database
 */
export async function cleanupPendingOrders() {
  try {
    // Calculate timestamp for 10 minutes ago
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    // Find pending orders older than 10 minutes
    const { data: pendingOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, created_at')
      .eq('status', 'pending')
      .lt('created_at', tenMinutesAgo);

    if (fetchError) {
      console.error('Error fetching pending orders:', fetchError);
      return;
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      console.log('No pending orders to clean up');
      return;
    }

    console.log(`Found ${pendingOrders.length} pending orders to cancel`);

    // Update orders to cancelled status
    const { data: updatedOrders, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .in('id', pendingOrders.map(o => o.id))
      .select();

    if (updateError) {
      console.error('Error updating orders:', updateError);
      return;
    }

    console.log(`Successfully cancelled ${updatedOrders?.length || 0} pending orders`);
  } catch (error) {
    console.error('Cleanup job error:', error);
  }
}

/**
 * Start the cleanup job interval
 * Runs every 5 minutes
 */
export function startCleanupJob() {
  console.log('Starting pending orders cleanup job (runs every 5 minutes)');
  
  // Run immediately on startup
  cleanupPendingOrders();

  // Then run every 5 minutes
  const interval = setInterval(cleanupPendingOrders, 5 * 60 * 1000);

  // Return cleanup function
  return () => {
    console.log('Stopping cleanup job');
    clearInterval(interval);
  };
}
