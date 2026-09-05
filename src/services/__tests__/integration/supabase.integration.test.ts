const hasSupabaseTestEnv =
  Boolean(process.env.SUPABASE_TEST_URL) &&
  Boolean(process.env.SUPABASE_TEST_ANON_KEY);

const describeIntegration = hasSupabaseTestEnv ? describe : describe.skip;

describeIntegration("Supabase integration", () => {
  it("requires configured test project", () => {
    expect(process.env.SUPABASE_TEST_URL).toBeTruthy();
    expect(process.env.SUPABASE_TEST_ANON_KEY).toBeTruthy();
  });
});
