<?php

namespace NS\CheckoutBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration.
 *
 * @link http://symfony.com/doc/current/cookbook/bundles/extension.html
 */
class NSCheckoutExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        // First Approach -> with method setparameter()
        array_map(function($parent) use ($config,$container) {
          foreach ($config[$parent] as $child => $value) {
            $container->setParameter( "ns_checkout.$parent.$child", $value); 
          }
        },array_keys($config));

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');

        // Second Approach -> with service
        // $configServiceDefinition = $container->getDefinition('ns_checkout.services.config_checkout');
        // $configServiceDefinition->addMethodCall('setConfig', [$config['booking']]);
    }
}
