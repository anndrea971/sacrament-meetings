// Leader-facing routes. Sign-in protection is added in Week 05.
export default function AdminLayout({ children }: LayoutProps<'/'>) {
  return (
    <div>
      <p className="mb-6 rounded-md bg-brand-light px-3 py-2 text-sm text-brand-dark print:hidden">
        Leader tools. Sign-in protection is coming in Week 05.
      </p>
      {children}
    </div>
  );
}
