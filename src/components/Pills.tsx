export function Pills({ items }: { items: string[] }) {
  return (
    <div className="pills">
      {items.map((item) => (
        <span className="pill" key={item}>
          {item}
        </span>
      ))}
    </div>
  )
}
