<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Not Found'], 404);
            }
            
            if ($request->inertia()) {
                return \Inertia\Inertia::render('errors/404')->toResponse($request)->setStatusCode(404);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
            
            if ($request->inertia()) {
                return \Inertia\Inertia::render('errors/403')->toResponse($request)->setStatusCode(403);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, \Illuminate\Http\Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => $e->getMessage()], $e->getStatusCode());
            }
            
            if ($request->inertia()) {
                $statusCode = $e->getStatusCode();
                
                if ($statusCode === 403) {
                    return \Inertia\Inertia::render('errors/403')->toResponse($request)->setStatusCode(403);
                }
                
                if ($statusCode === 404) {
                    return \Inertia\Inertia::render('errors/404')->toResponse($request)->setStatusCode(404);
                }
                
                if ($statusCode === 503) {
                    return \Inertia\Inertia::render('errors/503')->toResponse($request)->setStatusCode(503);
                }
            }
        });

        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Server Error'], 500);
            }
            
            if ($request->inertia() && !config('app.debug')) {
                return \Inertia\Inertia::render('errors/500')->toResponse($request)->setStatusCode(500);
            }
        });
    })->create();
