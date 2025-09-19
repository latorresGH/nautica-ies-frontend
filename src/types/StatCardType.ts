export type Props = {
  title: string;
  value?: string | number;
  icon?: React.ReactNode;   // usa el namespace React.* y no importás el tipo
  loading?: boolean;
};