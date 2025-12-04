import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';

export default function UnderConstruction() {
    return (
        <UserLayout>
            <Head title="Under Construction" />

            <div className="container mx-auto px-4">
                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <Construction className="h-12 w-12 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <h1 className="mb-3 text-3xl font-bold">
                        Under Construction
                    </h1>
                    <p className="max-w-md text-muted-foreground">
                        Payment feature is coming soon. We're working hard to
                        bring you the best shopping experience!
                    </p>
                </div>
            </div>
        </UserLayout>
    );
}
