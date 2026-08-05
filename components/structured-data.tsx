/** Renders one <script type="application/ld+json"> per schema object passed in. */
export function StructuredData({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((schema, i) => (
        // eslint-disable-next-line react/no-danger
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
