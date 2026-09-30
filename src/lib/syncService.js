import { supabase } from './supabase';

const TABLE = 'habit_tracker_store';

/**
 * Fetch a specific data key from Supabase cloud store.
 */
export async function fetchCloudData(key) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('data, updated_at')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.warn(`[AutoSync] Error fetching "${key}":`, error.message);
      return null;
    }
    return data ? data.data : null;
  } catch (err) {
    console.warn(`[AutoSync] Network error fetching "${key}":`, err);
    return null;
  }
}

/**
 * Fetch all keys in one network round-trip for fastest initial sync.
 */
export async function fetchAllCloudData() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('key, data, updated_at');

    if (error) {
      console.warn('[AutoSync] Error fetching all data:', error.message);
      return {};
    }

    const result = {};
    (data || []).forEach(row => {
      result[row.key] = {
        data: row.data,
        updatedAt: row.updated_at
      };
    });
    return result;
  } catch (err) {
    console.warn('[AutoSync] Network error fetching all data:', err);
    return {};
  }
}

/**
 * Save / Upsert a data key to Supabase cloud store.
 */
export async function saveCloudData(key, value) {
  try {
    const { error } = await supabase
      .from(TABLE)
      .upsert({
        key,
        data: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.warn(`[AutoSync] Error saving "${key}":`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[AutoSync] Network error saving "${key}":`, err);
    return false;
  }
}

/**
 * Subscribe to real-time changes on the habit_tracker_store table.
 * Automatically notifies callback when changes occur on localhost, Vercel, or any device.
 */
export function subscribeToCloudChanges(onUpdate) {
  try {
    const channel = supabase
      .channel('habit_tracker_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        (payload) => {
          if (payload.new && payload.new.key && payload.new.data) {
            onUpdate({
              key: payload.new.key,
              data: payload.new.data,
              updatedAt: payload.new.updated_at
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[AutoSync] Realtime subscription error:', err);
    return () => {};
  }
}
