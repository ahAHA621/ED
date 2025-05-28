/*
  # Add INSERT policy for subscriptions table

  1. Changes
    - Add RLS policy to allow authenticated users to insert their own subscription records
  
  2. Security
    - Policy ensures users can only create subscriptions for themselves
    - Maintains existing SELECT policy
*/

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);